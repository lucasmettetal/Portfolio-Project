import { Router } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';
import { generateRef, orderToJSON } from '../lib/utils.js';
import { sendOrderConfirmation } from '../lib/mailer.js';

const router = Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function stripeRefFromSession(sessionId) {
  return `R25-S${sessionId.slice(-6).toUpperCase()}`;
}

async function buildOrderItems(items) {
  const productIds = items.map(i => Number(i.product_id));
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const byId = Object.fromEntries(products.map(p => [p.id, p]));

  const orderCounts = new Map();
  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const productId = Number(item.product_id);
    orderCounts.set(productId, (orderCounts.get(productId) || 0) + item.quantity);
    const product = byId[productId];
    if (!product) throw new Error(`Produit ${item.product_id} introuvable`);
    orderItems.push({
      productId,
      name: product.name,
      price: product.price,
      size: item.size || null,
      quantity: item.quantity,
    });
    total += Number(product.price) * item.quantity;
  }

  for (const [productId, orderedQty] of orderCounts.entries()) {
    const product = byId[productId];
    if (!product) throw new Error(`Produit ${productId} introuvable`);
    if (!product.inStock || product.quantity < orderedQty) {
      throw new Error(`${product.name} n'est pas disponible en quantité suffisante`);
    }
  }

  return { total, orderItems };
}

// POST /api/stripe/checkout — crée une session Stripe Checkout
router.post('/checkout', optionalAuth, async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe non configuré. Ajoutez STRIPE_SECRET_KEY dans .env' });
  }

  const { items, customer_name, email, shipping } = req.body;
  if (!items?.length || !customer_name || !email) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  try {
    const productIds = items.map(i => Number(i.product_id));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const byId = Object.fromEntries(products.map(p => [p.id, p]));

    const orderCounts = new Map();
    const lineItems = [];
    for (const item of items) {
      const productId = Number(item.product_id);
      const product = byId[productId];
      if (!product) throw new Error(`Produit ${item.product_id} introuvable`);
      const nextCount = (orderCounts.get(productId) || 0) + item.quantity;
      orderCounts.set(productId, nextCount);
      if (!product.inStock || product.quantity < nextCount) {
        throw new Error(`${product.name} n'est pas disponible en quantité suffisante`);
      }
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            ...(item.size ? { description: `Taille : ${item.size}` } : {}),
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      metadata: {
        customer_name,
        email,
        shipping: shipping || '',
        items: JSON.stringify(items),
        user_id: req.authUser?.id?.toString() || '',
      },
      success_url: `${process.env.CLIENT_URL}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/stripe/verify/:sessionId — confirmation côté client (fallback si webhook en retard)
router.get('/verify/:sessionId', async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ error: 'Stripe non configuré' });

  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Paiement non confirmé' });
    }

    const stripeRef = stripeRefFromSession(req.params.sessionId);

    // Commande déjà créée par le webhook — on la retourne simplement
    const existing = await prisma.order.findFirst({
      where: { reference: stripeRef },
      include: { items: true },
    });
    if (existing) return res.json({ order: orderToJSON(existing), reference: existing.reference });

    // Fallback : le webhook n'a pas encore tiré, on crée la commande ici
    const { customer_name, email, items: itemsJson, user_id } = session.metadata;
    const items = JSON.parse(itemsJson);
    const { total, orderItems } = await buildOrderItems(items);
    const products = await prisma.product.findMany({ where: { id: { in: items.map(i => Number(i.product_id)) } } });
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          reference: stripeRef,
          customerName: customer_name,
          customerEmail: email,
          total,
          status: 'nouveau',
          userId: user_id ? Number(user_id) : null,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const product of products) {
        const orderedQty = items
          .filter(i => Number(i.product_id) === product.id)
          .reduce((sum, i) => sum + i.quantity, 0);
        const remaining = product.quantity - orderedQty;
        const updated = await tx.product.updateMany({
          where: { id: product.id, quantity: { gte: orderedQty } },
          data: { quantity: remaining, inStock: remaining > 0 },
        });
        if (updated.count === 0) {
          throw new Error(`Impossible de mettre à jour le stock pour ${product.name}`);
        }
      }

      return order;
    });

    sendOrderConfirmation({
      to: email,
      name: customer_name,
      reference: createdOrder.reference,
      items: createdOrder.items,
      total: createdOrder.total,
    });

    res.json({ order: orderToJSON(createdOrder), reference: createdOrder.reference });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

// ── Webhook Stripe (monté avant express.json dans index.js) ──────────────────
export async function stripeWebhook(req, res) {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ error: 'Stripe non configuré' });

  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: 'STRIPE_WEBHOOK_SECRET manquant' });

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).json({ error: `Signature invalide : ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status !== 'paid') return res.json({ received: true });

    const stripeRef = stripeRefFromSession(session.id);
    const exists = await prisma.order.findFirst({ where: { reference: stripeRef } });
    if (exists) return res.json({ received: true });

    const { customer_name, email, items: itemsJson, user_id } = session.metadata;
    const items = JSON.parse(itemsJson);
    const { total, orderItems } = await buildOrderItems(items);

    const products = await prisma.product.findMany({ where: { id: { in: items.map(i => Number(i.product_id)) } } });
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          reference: stripeRef,
          customerName: customer_name,
          customerEmail: email,
          total,
          status: 'nouveau',
          userId: user_id ? Number(user_id) : null,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const product of products) {
        const orderedQty = items
          .filter(i => Number(i.product_id) === product.id)
          .reduce((sum, i) => sum + i.quantity, 0);
        const remaining = product.quantity - orderedQty;
        const updated = await tx.product.updateMany({
          where: { id: product.id, quantity: { gte: orderedQty } },
          data: { quantity: remaining, inStock: remaining > 0 },
        });
        if (updated.count === 0) {
          throw new Error(`Impossible de mettre à jour le stock pour ${product.name}`);
        }
      }

      return order;
    });

    sendOrderConfirmation({
      to: email,
      name: customer_name,
      reference: createdOrder.reference,
      items: createdOrder.items,
      total: createdOrder.total,
    });
  }

  res.json({ received: true });
}

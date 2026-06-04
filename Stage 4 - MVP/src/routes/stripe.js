import { Router } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function generateRef() {
  return `R25-${Math.floor(Math.random() * 90000) + 10000}`;
}

function orderToJSON(o) {
  return {
    id: o.id,
    reference: o.reference,
    status: o.status,
    total: o.total,
    customer_name: o.customerName,
    email: o.customerEmail,
    created_at: o.createdAt,
    items: (o.items || []).map(i => ({
      id: i.id, name: i.name, price: i.price, size: i.size, quantity: i.quantity,
    })),
  };
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
    const lineItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: Number(item.product_id) } });
      if (!product) throw new Error(`Produit ${item.product_id} introuvable`);
      if (!product.inStock) throw new Error(`${product.name} est épuisé`);
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

// GET /api/stripe/verify/:sessionId — vérifie le paiement et crée la commande
router.get('/verify/:sessionId', async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ error: 'Stripe non configuré' });

  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Paiement non confirmé' });
    }

    const stripeRef = `R25-S${req.params.sessionId.slice(-6).toUpperCase()}`;
    const existing = await prisma.order.findFirst({
      where: { reference: stripeRef },
      include: { items: true },
    });
    if (existing) return res.json({ order: orderToJSON(existing), reference: existing.reference });

    const { customer_name, email, items: itemsJson, user_id } = session.metadata;
    const items = JSON.parse(itemsJson);

    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: Number(item.product_id) } });
      if (!product) continue;
      total += Number(product.price) * item.quantity;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        size: item.size || null,
        quantity: item.quantity,
      });
    }

    const order = await prisma.order.create({
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

    res.json({ order: orderToJSON(order), reference: order.reference });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

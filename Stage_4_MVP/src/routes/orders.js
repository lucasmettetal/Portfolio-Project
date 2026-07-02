import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth, requireCustomer } from '../middleware/auth.js';
import { generateRef, orderToJSON } from '../lib/utils.js';
import { sendOrderConfirmation } from '../lib/mailer.js';

const router = Router();

const VALID_STATUSES = ['nouveau', 'en cours', 'livré', 'annulé'];

// ── Public — place an order ─────────────────────────────────────────────────

router.post('/', requireCustomer, async (req, res) => {
  const { customer_name, email, items } = req.body;
  if (!customer_name || !email || !items?.length) {
    return res.status(400).json({ error: 'Données de commande incomplètes' });
  }
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return res.status(400).json({ error: 'La quantité doit être un entier positif' });
    }
  }

  try {
    const productIds = items.map(i => Number(i.product_id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const byId = Object.fromEntries(products.map(p => [p.id, p]));

    let total = 0;
    const orderItems = [];
    const orderCounts = new Map();

    for (const item of items) {
      const productId = Number(item.product_id);
      orderCounts.set(productId, (orderCounts.get(productId) || 0) + item.quantity);
      orderItems.push({
        productId,
        name: byId[productId]?.name || 'Produit inconnu',
        price: byId[productId]?.price || 0,
        size: item.size || null,
        quantity: item.quantity,
      });
      total += Number(byId[productId]?.price || 0) * item.quantity;
    }

    const productRemaining = new Map();
    for (const [productId, orderedQty] of orderCounts.entries()) {
      const product = byId[productId];
      if (!product) throw new Error(`Produit ${productId} introuvable`);
      if (!product.inStock || product.quantity < orderedQty) {
        throw new Error(`${product.name} n'est pas disponible en quantité suffisante`);
      }
      productRemaining.set(productId, product.quantity - orderedQty);
    }

    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          reference: generateRef(),
          customerName: customer_name,
          customerEmail: email,
          total,
          userId: req.authUser?.id || null,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const [id, remaining] of productRemaining.entries()) {
        const orderedQty = orderCounts.get(id);
        const updated = await tx.product.updateMany({
          where: { id, quantity: { gte: orderedQty } },
          data: { quantity: remaining, inStock: remaining > 0 },
        });
        if (updated.count === 0) {
          throw new Error('Impossible de mettre à jour le stock pour ce produit');
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

    res.status(201).json({ order: orderToJSON(createdOrder), reference: createdOrder.reference });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ── Admin ────────────────────────────────────────────────────────────────────

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [revenue, pending, total] = await Promise.all([
      prisma.order.aggregate({ where: { status: 'livré' }, _sum: { total: true } }),
      prisma.order.count({ where: { status: { in: ['nouveau', 'en cours'] } } }),
      prisma.order.count(),
    ]);
    res.json({
      revenue: Number(revenue._sum.total || 0),
      pendingOrders: pending,
      totalOrders: total,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders.map(orderToJSON));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status },
      include: { items: true },
    });
    res.json(orderToJSON(order));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Commande introuvable' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

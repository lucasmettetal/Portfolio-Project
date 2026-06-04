import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

const VALID_STATUSES = ['nouveau', 'en cours', 'livré', 'annulé'];

function generateRef() {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `R25-${n}`;
}

function toJSON(o) {
  return {
    id: o.id,
    reference: o.reference,
    status: o.status,
    total: o.total,
    customer_name: o.customerName,
    email: o.customerEmail,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
    items: (o.items || []).map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      size: i.size,
      quantity: i.quantity,
    })),
  };
}

// ── Public — place an order ─────────────────────────────────────────────────

router.post('/', optionalAuth, async (req, res) => {
  const { customer_name, email, items } = req.body;
  if (!customer_name || !email || !items?.length) {
    return res.status(400).json({ error: 'Données de commande incomplètes' });
  }
  try {
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: Number(item.product_id) },
      });
      if (!product) throw new Error(`Produit ${item.product_id} introuvable`);
      if (!product.inStock) throw new Error(`${product.name} est épuisé`);
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
        reference: generateRef(),
        customerName: customer_name,
        customerEmail: email,
        total,
        userId: req.authUser?.id || null,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json({ order: toJSON(order), reference: order.reference });
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
    res.json(orders.map(toJSON));
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
    res.json(toJSON(order));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Commande introuvable' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';

import authRoutes        from './routes/auth.js';
import productRoutes     from './routes/products.js';
import orderRoutes       from './routes/orders.js';
import stripeRoutes, { stripeWebhook } from './routes/stripe.js';
import customOrderRoutes from './routes/customOrders.js';
import uploadRoutes      from './routes/upload.js';
import contactRoutes     from './routes/contact.js';

const app = express();

app.set('trust proxy', 1); // derrière nginx en production (Docker)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // autorise /uploads depuis le frontend
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// Le webhook Stripe nécessite le body brut — doit être monté avant express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'rue25-api' }));

app.use('/api/auth',          authRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/stripe',        stripeRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/upload',        uploadRoutes);
app.use('/api/contact',       contactRoutes);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Rue 25 API — http://localhost:${PORT}`));

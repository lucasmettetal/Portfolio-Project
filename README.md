# Rue 25 — Vêtements Artisanaux

Site e-commerce pour une marque de vêtements artisanaux français, avec boutique, panier, commandes, paiement Stripe, espace client, service sur mesure et dashboard admin.

**Stack :** React 18 + Vite + Tailwind CSS · Node.js + Express · PostgreSQL · Prisma ORM · Docker · Stripe

---

## Prérequis

- Node.js 18+
- Docker Desktop (pour PostgreSQL)
- Un compte Stripe (pour les paiements par carte)

---

## Installation locale

### 1. Base de données (Docker)

```bash
docker run -d \
  --name rue25-db \
  -e POSTGRES_USER=rue25 \
  -e POSTGRES_PASSWORD=rue25 \
  -e POSTGRES_DB=rue25 \
  -p 5433:5432 \
  postgres:17-alpine
```

> Le port **5433** est utilisé pour éviter les conflits avec un PostgreSQL natif sur 5432.

### 2. Backend

```bash
cd backend
npm install

# Copiez et remplissez le fichier d'environnement
cp .env.example .env
# → Éditez DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY

# Créez les tables (migrations Prisma)
npx prisma migrate deploy

# Insérez les données de démo (catégories, produits, admin)
node prisma/seed.js

# Démarrez le serveur (port 3001)
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Ouvrez **http://localhost:5173**

---

## Comptes par défaut (après seed)

| Rôle  | Email            | Mot de passe |
|-------|------------------|--------------|
| Admin | admin@rue25.fr   | admin25      |

---

## Routes API

### Produits
| Méthode | Route                     | Auth  | Description                              |
|---------|---------------------------|-------|------------------------------------------|
| GET     | /api/products             | —     | Liste produits (filtres: category, search) |
| GET     | /api/products/:id         | —     | Détail produit                           |
| GET     | /api/products/categories  | —     | Liste des catégories                     |
| POST    | /api/products             | Admin | Créer un produit                         |
| PUT     | /api/products/:id         | Admin | Modifier un produit                      |
| DELETE  | /api/products/:id         | Admin | Supprimer un produit                     |

### Commandes
| Méthode | Route                     | Auth    | Description                |
|---------|---------------------------|---------|----------------------------|
| POST    | /api/orders               | —       | Passer une commande        |
| GET     | /api/orders               | Admin   | Liste commandes            |
| GET     | /api/orders/stats         | Admin   | Stats dashboard            |
| PATCH   | /api/orders/:id/status    | Admin   | Changer le statut          |

### Authentification
| Méthode | Route                        | Auth     | Description               |
|---------|------------------------------|----------|---------------------------|
| POST    | /api/auth/login              | —        | Connexion admin → JWT     |
| POST    | /api/auth/register           | —        | Inscription client        |
| POST    | /api/auth/customer/login     | —        | Connexion client          |
| GET     | /api/auth/me                 | Client   | Profil connecté           |
| GET     | /api/auth/my-orders          | Client   | Historique commandes      |

### Stripe
| Méthode | Route                        | Auth     | Description               |
|---------|------------------------------|----------|---------------------------|
| POST    | /api/stripe/checkout         | —        | Créer session paiement    |
| GET     | /api/stripe/verify/:id       | —        | Vérifier & créer commande |

### Sur Mesure
| Méthode | Route                              | Auth    | Description                |
|---------|------------------------------------|---------|----------------------------|
| POST    | /api/custom-orders                 | —       | Soumettre une demande      |
| GET     | /api/custom-orders                 | Admin   | Lister les demandes        |
| GET     | /api/custom-orders/:id             | Admin   | Détail demande             |
| PATCH   | /api/custom-orders/:id/status      | Admin   | Changer le statut          |

---

## Structure du projet

```
rue25_project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modèles (User, Product, Order, CustomOrder…)
│   │   ├── migrations/        # Migrations SQL générées par Prisma
│   │   └── seed.js            # Données initiales
│   └── src/
│       ├── lib/
│       │   └── prisma.js      # Client Prisma singleton
│       ├── middleware/
│       │   └── auth.js        # requireAuth / requireCustomer / optionalAuth
│       ├── routes/
│       │   ├── auth.js
│       │   ├── products.js
│       │   ├── orders.js
│       │   ├── stripe.js
│       │   └── customOrders.js
│       └── index.js
│
└── frontend/
    └── src/
        ├── lib/
        │   └── api.js             # Tous les appels HTTP
        ├── hooks/
        │   ├── useAuth.jsx        # Auth admin
        │   ├── useCustomerAuth.jsx # Auth client
        │   └── useCart.jsx        # Panier localStorage
        ├── pages/
        │   ├── Storefront.jsx
        │   ├── SurMesurePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── AccountPage.jsx
        │   ├── OrderSuccess.jsx
        │   ├── AdminLogin.jsx
        │   └── AdminDashboard.jsx
        └── components/
            ├── ProductModal.jsx
            └── CartDrawer.jsx
```

---

## Variables d'environnement

Copiez `backend/.env.example` en `backend/.env` et remplissez les valeurs.

| Variable             | Description                                      |
|----------------------|--------------------------------------------------|
| `DATABASE_URL`       | URL PostgreSQL (ex: `postgresql://rue25:rue25@127.0.0.1:5433/rue25`) |
| `JWT_SECRET`         | Clé secrète pour signer les tokens JWT (min 32 chars) |
| `ADMIN_EMAIL`        | Email du compte administrateur                   |
| `ADMIN_PASSWORD`     | Mot de passe administrateur (hashé au seed)      |
| `STRIPE_SECRET_KEY`  | Clé secrète Stripe (`sk_test_…` ou `sk_live_…`)  |
| `CLIENT_URL`         | URL du frontend (ex: `http://localhost:5173`)     |

---

## Paiement Stripe (test)

Utilisez la carte de test Stripe :
- Numéro : `4242 4242 4242 4242`
- Date : n'importe quelle date future
- CVC : n'importe (ex: `123`)

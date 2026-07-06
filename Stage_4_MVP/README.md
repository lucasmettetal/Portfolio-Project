# Rue 25 — Handcrafted Clothing

E-commerce site for a French handcrafted clothing brand. Online store, cart, Stripe payment, customer account, made-to-measure service, admin dashboard, GDPR.

**Stack:** React 18 · Vite · Tailwind CSS · Node.js · Express · PostgreSQL · Prisma ORM · Docker · Stripe

---

## Application architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          Browser                             │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP (port 5173 dev / 80 prod)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    nginx (frontend)                         │
│  • Serves static React files (Vite build)                   │
│  • Proxy  /api/*      → backend:3001                        │
│  • Proxy  /uploads/*  → backend:3001                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               Express API (Node.js · port 3001)             │
│                                                             │
│  Middlewares: helmet · cors · express-rate-limit            │
│                                                             │
│  Routes:                                                    │
│  /api/auth          → JWT auth (admin + customer)           │
│  /api/products      → Product CRUD                          │
│  /api/orders        → Orders (customer auth required)       │
│  /api/stripe        → Checkout + signed webhook              │
│  /api/custom-orders → Made-to-measure requests               │
│  /api/upload        → Image upload (admin)                   │
│  /api/contact       → Contact form                           │
│  /uploads           → Static files (product images)         │
└──────┬─────────────────────────────┬────────────────────────┘
       │                             │
       ▼                             ▼
┌──────────────┐             ┌───────────────┐
│  PostgreSQL  │             │  External APIs │
│  (Prisma ORM)│             │  • Stripe      │
│              │             │  • SMTP Gmail  │
└──────────────┘             └───────────────┘
```

---

## Database schema

```
┌─────────────┐       ┌──────────────┐       ┌───────────────┐
│    users    │       │   products   │       │  categories   │
│─────────────│       │──────────────│       │───────────────│
│ id (PK)     │       │ id (PK)      │       │ id (PK)       │
│ email       │       │ name         │       │ name          │
│ password    │       │ slug         │       │ slug          │
│ first_name  │       │ description  │       │ description   │
│ last_name   │       │ price        │       └───────────────┘
│ role        │       │ image_url    │              ▲
│ created_at  │       │ in_stock     │              │ category_id
└──────┬──────┘       │ quantity     │─────────────►│
       │              │ sizes[]      │
       │ user_id      │ materials[]  │
       ▼              └──────┬───────┘
┌──────────────┐             │ product_id
│   orders     │             ▼
│──────────────│      ┌──────────────┐
│ id (PK)      │◄─────│ order_items  │
│ reference    │      │──────────────│
│ status       │      │ id (PK)      │
│ total        │      │ order_id (FK)│
│ customer_name│      │ product_id(FK│
│ customer_email      │ name         │
│ user_id (FK) │      │ price        │
│ address_id(FK│      │ size         │
└──────────────┘      │ quantity     │
                      └──────────────┘

┌────────────────┐    ┌────────────────────┐
│   addresses    │    │   custom_orders    │
│────────────────│    │────────────────────│
│ id (PK)        │    │ id (PK)            │
│ user_id (FK)   │    │ reference          │
│ first_name     │    │ status             │
│ last_name      │    │ name               │
│ street         │    │ email              │
│ city           │    │ garment_type       │
│ postal_code    │    │ description        │
│ country        │    │ chest/waist/hips…  │
│ is_default     │    │ budget / timeline  │
└────────────────┘    └────────────────────┘
```

**Relations:**
- `User` → `Order`: 1 user can have multiple orders (1-N)
- `User` → `Address`: 1 user can have multiple addresses (1-N)
- `Order` → `OrderItem`: 1 order contains multiple items (1-N)
- `Product` → `OrderItem`: 1 product can appear in multiple orders (1-N)
- `Category` → `Product`: 1 category groups multiple products (1-N)
- `CustomOrder`: independent entity, not linked to a customer account (public form)

---

## Features

### Customer side
| Feature | Description |
|---|---|
| Catalog | Product list with filters (category, search) |
| Cart | Persisted in localStorage, with quantities and sizes |
| Payment | Stripe Checkout (test: `4242 4242 4242 4242`) |
| Customer account | Sign up, login, order history |
| Made-to-measure | Form with measurements → quote by email |
| Contact | Form with rate limiting (5/h) |
| GDPR | Privacy policy, legal notice, cookie banner |

### Admin side (`/admin`)
| Feature | Description |
|---|---|
| Dashboard | Revenue stats, pending orders, total |
| Products | Full CRUD + image upload |
| Orders | List + status changes |
| Made-to-measure | List + status changes for requests |

---

## Security

| Mechanism | Implementation |
|---|---|
| Authentication | JWT signed with a 32+ character secret, 7-day expiration |
| Password hashing | bcrypt cost factor 12 |
| RBAC | Two roles: `ADMIN` (dashboard) and `USER` (customer) |
| Rate limiting | 10 attempts/15min (auth), 5/h (contact) |
| Stripe webhook | Signature verified with `constructEvent()` |
| HTTP headers | `helmet`: X-Content-Type-Options, X-Frame-Options, HSTS… |
| File upload | MIME filter + extension allowlist (.jpg .png .webp…) |
| HTML injection | User input escaped in emails |
| CORS | Strict allowlist via `CLIENT_URL` |
| Stock | Atomic Prisma transaction + optimistic lock |

---

## Quick start (Docker)

```bash
cp .env.example .env
# Edit JWT_SECRET, STRIPE_SECRET_KEY, and optionally SMTP_*

docker compose up --build -d
```

On first start: automatic migrations + seed (products, admin).

Open **http://localhost:5173**

---

## Manual installation

### Prerequisites
- Node.js 20+
- PostgreSQL

### Backend
```bash
cp .env.example .env
npm install
npm run setup    # migrations + seed if the database is empty
npm run dev      # http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

---

## Default accounts

| Role  | Email          | Password |
|-------|----------------|--------------|
| Admin | admin@rue25.fr | *(set in .env → ADMIN_PASSWORD)* |

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✓ | PostgreSQL URL |
| `JWT_SECRET` | ✓ | JWT secret key (min 32 random characters) |
| `ADMIN_EMAIL` | | Admin email (default: `admin@rue25.fr`) |
| `ADMIN_PASSWORD` | | Initial admin password |
| `CLIENT_URL` | | Frontend URL for CORS (default: `http://localhost:5173`) |
| `STRIPE_SECRET_KEY` | ✓ | Stripe key (`sk_test_…` or `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | | Stripe webhook secret (`whsec_…`) |
| `SMTP_HOST` | | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | | SMTP port (default: `587`) |
| `SMTP_USER` | | Sending email address |
| `SMTP_PASS` | | SMTP app password |

> SMTP variables are optional: if missing, emails are silently skipped.

---

## Stripe webhook (local testing)

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
# Copy the whsec_... into STRIPE_WEBHOOK_SECRET
```

Test card: `4242 4242 4242 4242` · any future date · any CVC

---

## API routes

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | — | Admin login |
| POST | /api/auth/register | — | Customer sign up |
| POST | /api/auth/customer/login | — | Customer login |
| GET | /api/auth/me | Customer | Logged-in profile |
| GET | /api/auth/my-orders | Customer | Order history |

### Products
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /api/products | — | Catalog (filters: category, search) |
| GET | /api/products/:id | — | Product detail |
| POST | /api/products | Admin | Create |
| PUT | /api/products/:id | Admin | Update |
| DELETE | /api/products/:id | Admin | Delete |

### Orders
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/orders | **Customer** | Place an order |
| GET | /api/orders | Admin | List orders |
| GET | /api/orders/stats | Admin | Dashboard stats |
| PATCH | /api/orders/:id/status | Admin | Change status |

### Stripe
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/stripe/checkout | Customer | Create Checkout session |
| POST | /api/stripe/webhook | — (signed) | Stripe webhook |
| GET | /api/stripe/verify/:id | — | Verify payment (fallback) |

### Made-to-measure & Contact
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/custom-orders | — | Submit a request |
| GET | /api/custom-orders | Admin | List requests |
| PATCH | /api/custom-orders/:id/status | Admin | Change status |
| POST | /api/contact | — | Send a message (5/h) |

---

## Project structure

```
Stage_4_MVP/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── prisma/
│   ├── schema.prisma       # Models: User, Product, Category, Order, OrderItem, CustomOrder, Address
│   ├── migrations/
│   └── seed.js             # Initial data
├── scripts/
│   └── seed-if-empty.mjs   # Automatic seed on startup if the database is empty
├── src/
│   ├── index.js            # Express entry point (helmet, cors, routes)
│   ├── lib/
│   │   ├── prisma.js       # Prisma singleton client
│   │   ├── mailer.js       # Emails (Nodemailer, fire-and-forget)
│   │   └── utils.js        # generateRef (crypto.randomInt), orderToJSON
│   ├── middleware/
│   │   └── auth.js         # requireAuth / requireCustomer / optionalAuth
│   └── routes/
│       ├── auth.js         # Admin + customer login (rate limited)
│       ├── products.js     # Product CRUD
│       ├── orders.js       # Orders + atomic stock management
│       ├── stripe.js       # Checkout + signed webhook
│       ├── customOrders.js # Made-to-measure requests
│       ├── upload.js       # Image upload (multer, admin only)
│       └── contact.js      # Contact form (rate limited)
└── frontend/
    ├── Dockerfile          # Vite build → nginx
    ├── nginx.conf          # SPA + proxy /api and /uploads → backend
    └── src/
        ├── lib/api.js      # All HTTP calls centralized
        ├── hooks/
        │   ├── useAuth.jsx          # Admin auth (localStorage)
        │   ├── useCustomerAuth.jsx  # Customer auth (localStorage)
        │   └── useCart.jsx          # Cart (persisted in localStorage)
        ├── components/
        │   ├── ProductModal.jsx     # Product modal + add to cart
        │   ├── CartDrawer.jsx       # Side cart + checkout
        │   └── CookieBanner.jsx     # Cookie consent banner
        └── pages/
            ├── Storefront.jsx          # Main storefront
            ├── AboutPage.jsx           # Our story
            ├── ContactPage.jsx         # Contact form
            ├── SurMesurePage.jsx       # Made-to-measure request
            ├── LoginPage.jsx           # Customer login
            ├── RegisterPage.jsx        # Customer sign up
            ├── AccountPage.jsx         # Customer account area
            ├── OrderSuccess.jsx        # Stripe payment confirmation
            ├── AdminLogin.jsx          # Admin login
            ├── AdminDashboard.jsx      # Admin dashboard
            ├── PrivacyPage.jsx         # Privacy policy
            └── LegalPage.jsx           # Legal notice
```

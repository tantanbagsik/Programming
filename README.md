# EduLearn — Full-Stack E-Learning Platform

A production-ready e-learning platform built with **Next.js 14**, **MongoDB**, **NextAuth**, and **Stripe**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v4 (Credentials + Google + GitHub) |
| Payments | Stripe Checkout + Webhooks |
| Styling | Tailwind CSS + Custom Animations |
| Language | TypeScript |
| Deployment | Vercel + MongoDB Atlas |

---

## 📁 Project Structure

```
edulearn/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # NextAuth config
│   │   │   │   └── register/route.ts        # User registration
│   │   │   ├── courses/
│   │   │   │   ├── route.ts                 # GET list, POST create
│   │   │   │   └── [slug]/route.ts          # GET, PATCH, DELETE
│   │   │   ├── enrollments/
│   │   │   │   ├── route.ts                 # GET user enrollments
│   │   │   │   └── [courseId]/progress/route.ts
│   │   │   ├── payments/
│   │   │   │   ├── checkout/route.ts        # Stripe checkout session
│   │   │   │   └── webhook/route.ts         # Stripe webhook handler
│   │   │   └── admin/
│   │   │       ├── stats/route.ts           # Dashboard stats
│   │   │       └── users/route.ts           # User management
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/page.tsx               # Student dashboard
│   │   ├── admin/page.tsx                   # Admin dashboard
│   │   ├── payment/success/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx                         # Homepage
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Providers.tsx
│   │   └── home/
│   │       ├── HeroSection.tsx
│   │       └── index.tsx                    # All home sections
│   ├── models/
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Enrollment.ts
│   │   └── Review.ts                        # Review + Payment models
│   └── lib/
│       └── mongodb.ts                       # DB connection singleton
├── scripts/
│   └── seed.ts                              # Database seeder
├── .env.example                             # Environment template
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started with OpenCode

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Stripe account
- (Optional) Google & GitHub OAuth apps

### 2. Clone / Open in OpenCode

Open the project folder in OpenCode. It will detect the Next.js project automatically.

### 3. Install dependencies

```bash
npm install
```

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# MongoDB — get from MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/edulearn

# NextAuth — generate a secret with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Stripe — from stripe.com/dashboard
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...    # from `stripe listen` output

# Public
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5. Seed the database

```bash
npm run seed
```

This creates test accounts:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edulearn.com | Password123! |
| Instructor | sarah@edulearn.com | Password123! |
| Student | student@edulearn.com | Password123! |

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Set up Stripe webhooks (local)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Copy the `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/[...nextauth]` | NextAuth (login, OAuth, session) |

### Courses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/courses` | List published courses | Public |
| POST | `/api/courses` | Create course | Instructor/Admin |
| GET | `/api/courses/:slug` | Get course detail | Public |
| PATCH | `/api/courses/:slug` | Update course | Owner/Admin |
| DELETE | `/api/courses/:slug` | Delete course | Owner/Admin |

**Query params for GET /api/courses:**
- `page`, `limit` — pagination
- `category` — filter by category
- `level` — beginner/intermediate/advanced/all-levels
- `search` — full-text search
- `sort` — popular/newest/price-asc/price-desc/rating

### Enrollments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/enrollments` | Get my enrollments | Student |
| POST | `/api/enrollments/:courseId/progress` | Update lesson progress | Student |

### Payments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/checkout` | Create Stripe session | Student |
| POST | `/api/payments/webhook` | Stripe webhook | Stripe |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Platform stats | Admin |
| GET | `/api/admin/users` | List users | Admin |
| PATCH | `/api/admin/users` | Update user role | Admin |

---

## 🗄️ MongoDB Schema

### User
```
name, email, password (hashed), image, role (student/instructor/admin),
bio, stripeCustomerId, emailVerified
```

### Course
```
title, slug, description, shortDescription, thumbnail, instructor (ref User),
category, tags, level, price, discountPrice, currency,
sections[{ title, lessons[{ title, videoUrl, duration, isFree }] }],
totalLessons, totalDuration, requirements, whatYouLearn,
isPublished, isFeatured, enrollmentCount, rating, reviewCount,
stripeProductId, stripePriceId
```

### Enrollment
```
user (ref User), course (ref Course), status (active/completed/refunded),
progress (0-100), lessonsProgress[{ lessonId, watchedSeconds, completedAt }],
lastAccessedAt, completedAt, paymentId, amountPaid, certificateUrl
```

### Review
```
user (ref User), course (ref Course), rating (1-5), comment
```

### Payment
```
user, course, stripeSessionId, stripePaymentIntentId,
amount, currency, status (pending/succeeded/failed/refunded)
```

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all env vars in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

For Stripe webhooks in production:
1. Add `https://yourdomain.com/api/payments/webhook` in Stripe dashboard
2. Update `STRIPE_WEBHOOK_SECRET` with the production webhook secret

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT sessions via NextAuth
- Admin routes protected server-side with role checks
- Stripe webhook signature verified
- MongoDB queries use Mongoose schemas with validation
- Course content gated — paid video URLs only returned to enrolled users

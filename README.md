#  Campus Tent 

> **Verified Student Housing, Off-Campus Accommodation & Roommate Finder Platform**  
> Built for Nigerian tertiary institutions (FUPRE, UNIBEN, DELSU, DOU, and more).

---

## Overview

**Campus Tent** is a modern, student-first real estate and accommodation ecosystem designed to eliminate housing stress, agent fraud, and rental scams around Nigerian university campuses. 

The platform bridges university students, verified property agents/landlords, and student roommates through a secure, transparent, escrow-backed inspection and rental experience.

---

## Key Features

### 1. Property Discovery & Campus Filtering
- **University Campus Dropdowns**: Fast filtering by institution (Federal University of Petroleum Resources Effurun - FUPRE, University of Benin - UNIBEN, Delta State University - DELSU, Dennis Osadebay University - DOU, etc.).
- **Specific Amenities Matching**: Filters for essential amenities including *Kitchen Cabinet, Water Heater, Under-Decking Ceiling, White-Board Ceiling, Borehole Water, Prepaid Meter, 24/7 Security, and Furnished Spaces*.
- **Interactive Map & Virtual Walkthroughs**: Video tours and high-resolution photo galleries for hostels and apartments.

### 2. Roommate Matching Network
- **Roommate Listings & Pairing**: Students can list vacant spaces in their apartments to share rent.
- **Direct WhatsApp & Phone Access**: Immediate student-to-student inquiry contact with direct WhatsApp chat links (`wa.me`) without inspection fees.
- **Compatibility Preferences**: Department, level, lifestyle preferences, and study habits.

### 3. Inspection Booking & Escrow Protection
- **Standardized Inspection Fee**: Flat ₦7,500 inspection fee with dual payment gateways (Paystack Instant Checkout & Direct Bank Transfer).
- **Financial Escrow Breakdown**:
  - **Campus Tent Platform Fee**: ₦2,490
  - **Agent Escrow Payout**: ₦5,010
- **Automated Dispute & Refund Settlement**:
  - Full dispute audit trails for unsatisfactory or misrepresented inspections.
  - Settle disputes with student refund allocation (e.g. ₦5,000 refunded to student, ₦2,500 platform retention).

### 4. Real-Time WebSocket Chat
- **Instant Messaging**: Powered by **Pusher WebSockets** with fallback polling.
- **Optimized ChatInput Component**: Self-contained state management, automatic whitespace trimming, double-submit protection, and auto-focus retention.
- **Mobile-Responsive Keyboard Adaptation**: Dynamic viewport height (`100dvh`), keyboard panning mitigation, and iOS auto-zoom prevention.

###  5. Role-Based Portals & Dashboards
- **Student Dashboard**: Track active inspection requests, roommate pairings, and identity verification.
- **Agent Dashboard**: Property management, photo uploads, student inquiry tracking, payout bank details, and lead conversion analytics.
- **Admin Portal**:
  - Two-Factor Authentication (2FA TOTP with encrypted backup codes).
  - Financial Ledger & Payout Disbursements (batch agent transfers).
  - Dispute Resolution Center.
  - Analytics Overview with revenue charts, transaction volume metrics, and user moderation.
- **Campus Ambassador Hub**: Track student referrals and campus growth.

###  6. Unified Design System & Typography
- **Standardized Typography**: Uniform `'Poppins', sans-serif` font system across all components, forms, navigation bars, and Chart.js dashboards.
- **Responsive Layout**: Designed mobile-first for smooth performance on screens ranging from small smartphones (360px) to ultra-wide displays.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS, Modular CSS, CSS Variables |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Real-Time** | Pusher Channels (`pusher-js` & `pusher`) |
| **Payments** | Paystack API & Webhooks |
| **Email Delivery** | Resend API |
| **Icons & Media** | Font Awesome 6.5, Cloudinary |

---

##  Getting Started

### Prerequisites
- **Node.js** 18.18+ or 20+
- **npm**, **yarn**, or **pnpm**
- **PostgreSQL** database instance

### 1. Clone the Repository
```bash
git clone https://github.com/OreziiMena/CAMPUS-STAY-.git
cd CAMPUS-STAY-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/campustent?schema=public"

# Authentication & Session Secrets
JWT_SECRET="your-secure-jwt-secret"
COOKIE_SECRET="your-secure-cookie-secret"

# Paystack Payment Gateway
PAYSTACK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."

# Pusher WebSockets
PUSHER_APP_ID="your-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="eu"

# Email Services (Resend)
RESEND_API_KEY="re_..."
SYSTEM_EMAIL="noreply@campustent.com"

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-P554J4HTVD"
```

### 4. Database Setup & Migrations
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/
│   ├── actions/               # Server Actions (auth, admin, chat, student, inspection, etc.)
│   ├── admin-dashboard/       # Admin Portal (KPIs, payments ledger, disputes, analytics)
│   ├── agent-dashboard/       # Agent & Host Hub (listings, inquiries, payout setup)
│   ├── student-dashboard/     # Student Hub (bookings, roommate ads, profile)
│   ├── apartment-details/     # Hostel detail page, photo gallery & tour booking
│   ├── api/                   # Route handlers (Paystack webhooks, Pusher auth, upload)
│   ├── auth/                  # Authentication flows (login, signup, role-picker, reset)
│   ├── chat/                  # Real-time WebSocket messaging workspace
│   ├── explore/               # Campus hostel catalog with search & multi-filters
│   ├── partner/[slug]/        # Dedicated partner estate pages (e.g., EasyVille Estates)
│   ├── roommates/             # Roommate finder & pairing marketplace
│   ├── globals.css            # Platform-wide CSS variables & core resets
│   └── layout.tsx             # Root layout & global metadata
├── components/                # Reusable UI components (Navbar, Footer, ChatInput, Modals)
├── lib/                       # Utility libraries (prisma, pusher, email, paystack, universities)
├── prisma/
│   └── schema.prisma          # Database schema definitions
└── public/                    # Static assets, branding, and icons
```

---

## Verification & Testing

Verify TypeScript compilation and type safety:
```bash
npx tsc --noEmit
```

Build for production:
```bash
npm run build
```

---

##  Security & Data Integrity

- **Role-Based Authorization**: Enforced on server actions and routes for Students, Agents, and Administrators.
- **Admin 2FA Security**: Multi-factor authentication via TOTP with encrypted recovery codes.
- **Payment Verification**: Dual verification via cryptographic Paystack webhook signatures and manual receipt audits.
- **Contact Privacy**: Phone numbers masked until formal inspection verification, with roommate contact directly unlocked.

---

##  License

This project is proprietary and confidential. All rights reserved by **Campus Tent**.

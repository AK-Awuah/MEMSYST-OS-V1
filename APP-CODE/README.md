# MEMSYST OS — Multi-Tenant Membership Operating System

A comprehensive multi-tenant membership management platform built with Next.js 16 (App Router), Firebase, React 19, and Tailwind CSS v4.

## Architecture

```
APP-CODE/
├── src/
│   ├── app/           # Next.js App Router — routes, layouts, error pages
│   │   ├── app/       # Authenticated app shell (admin dashboard)
│   │   ├── api/       # API routes (health check, etc.)
│   │   └── ...        # Public/marketing pages
│   ├── components/    # Shared UI components
│   ├── contexts/      # React contexts (auth, tenant)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Firebase client, utilities
│   ├── services/      # Service factories (AI, Platform, Analytics, etc.)
│   └── types/         # TypeScript types
├── scripts/           # Seed, deploy, utility scripts
├── public/            # Static assets, PWA manifest, service worker
├── __tests__/         # Vitest unit tests
├── firestore.rules    # Firestore security rules
├── firestore.indexes.json  # Firestore composite indexes
├── Dockerfile         # Standalone production build
└── .github/workflows/ # CI/CD pipeline
```

## Prerequisites

- Node.js 22+
- Firebase project with Firestore enabled
- (Optional) Sentry DSN for error tracking
- (Optional) Google Analytics tracking ID

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase config

# Run development server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry error tracking DSN |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics tracking ID |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test` | Run Vitest unit tests (watch mode) |
| `npm test -- --run` | Run tests once |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed Firestore with initial data |
| `npm run deploy:firestore` | Deploy Firestore rules & indexes |

## Deployment

### Docker
```bash
docker build -t memsyst .
docker run -p 3000:3000 memsyst
```

### Firestore
```bash
npm run deploy:firestore
```

### Manual
```bash
npm run build
npm start
```

## Features

- **Multi-tenant** — Organizations with isolated data
- **Role-based access** — Granular permission system
- **Events** — Full event lifecycle management
- **Governance** — Elections, committees, meetings, resolutions
- **Analytics** — Dashboards, reports, scheduled exports
- **Integration Marketplace** — API keys, webhooks
- **AI Assistant** — AI-powered member support
- **Platform Operations** — Plans, subscriptions, tickets, partners
- **Advertising Engine** — Ads, campaigns, sponsors
- **Tiering & Scaling** — Premium accounts, featured listings, visibility rules
- **PWA-ready** — Manifest and service worker included
- **Error Monitoring** — Sentry integration (opt-in)
- **CI/CD** — GitHub Actions pipeline (lint, typecheck, test, build)

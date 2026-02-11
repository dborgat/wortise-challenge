# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CMS (Wortise Challenge) — a full-stack Content Management System built with Next.js 16 App Router, tRPC, MongoDB, and React 19.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint (flat config, v9)
npm run db:test      # Test MongoDB connection and initialize indexes
```

No test framework is configured yet.

## Architecture

### Stack

- **Next.js 16.1.6** with App Router, React 19, TypeScript (strict mode)
- **tRPC 11.10.0** with React Query for type-safe API layer
- **MongoDB 6.21.0** native driver (no ORM)
- **Zod 4** for input validation on tRPC procedures
- **SuperJSON** as tRPC transformer (handles Date, Map, Set serialization)
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **Better Auth** — declared as dependency but not yet integrated
- **React Hook Form** with `@hookform/resolvers` for forms (not yet used)

### tRPC Data Flow

```
React component (useQuery/useMutation)
  → lib/trpc/client.tsx (TRPCProvider + httpBatchLink → /api/trpc)
  → app/api/trpc/[trpc]/route.ts (fetchRequestHandler)
  → lib/trpc/context.ts (creates { db, user } context per request)
  → server/routers/_app.ts (merges sub-routers)
  → server/routers/article.ts | auth.ts (procedures)
  → server/db/collections.ts (MongoDB collections)
```

Server-side tRPC calls use `lib/trpc/server.ts` which exports `createCaller()`.

### Key Directories

- `lib/trpc/` — tRPC initialization (`init.ts`), context (`context.ts`), React client with TRPCProvider (`client.tsx`), server caller (`server.ts`)
- `server/routers/` — tRPC routers. `_app.ts` is the root router merging `article` and `auth` sub-routers
- `server/db/` — MongoDB connection singleton (`mongo.ts`), collection types and getters with index setup (`collections.ts`)
- `app/(auth)/` — Route group for login/register pages (placeholder)
- `app/(dashboard)/` — Route group for dashboard pages (placeholder)

### Database

MongoDB database name: `cms-wortise`. Two collections:
- **users** — unique index on `email`, fields: email, name, password (hashed), createdAt, updatedAt
- **articles** — index on `authorId`, text index on title+content, fields: title, content, coverImage (URL), authorId, createdAt, updatedAt

Connection uses global singleton pattern (`server/db/mongo.ts`) to survive HMR in development.

### tRPC Procedures

Procedures use `publicProcedure` (no auth) or `protectedProcedure` (requires authenticated user via `isAuthenticated` middleware in `lib/trpc/init.ts`).

- **article.getAll / getById** (public), **article.create / update / delete / getMyArticles** (protected)
- **auth.getSession / register / login** (public), **auth.logout** (protected)

Auth procedures are currently placeholders awaiting Better Auth integration.

### Path Alias

`@/*` maps to project root (configured in `tsconfig.json`). Use `@/server/...`, `@/lib/...`, etc.

## Environment Variables

Required in `.env.local` (gitignored):
- `MONGODB_URI` — MongoDB connection string
- `BETTER_AUTH_SECRET` — Auth secret key
- `BETTER_AUTH_URL` — Auth base URL (e.g., `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL` — Public app URL

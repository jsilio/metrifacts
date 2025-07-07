# Metrifacts

A full-stack metrics tracking application that enables users to create, monitor, and visualize key performance indicators in real-time.

## Project Overview

This project is a monorepo built with modern TypeScript tooling (Next.js, Hono, Prisma, TailwindCSS, shadcn/ui). It uses **Turborepo** for monorepo orchestration and **pnpm workspaces** for efficient dependency management. Users can create custom metrics, log timestamped data points, and visualize trends with interactive charts powered by Recharts.

### Tech Stack

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **React Query** - Async state management and caching
- **React Hook Form** - Form handling with validation
- **Recharts** - Interactive charts and data visualization
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **Node.js** - Runtime environment
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) (recommended version: 10.x or above)
- Node.js (18+)
- PostgreSQL database

### Install dependencies

```bash
pnpm install
```

### Database Setup

This project uses PostgreSQL with Prisma. You can either use a local PostgreSQL instance or create a cloud database:

**Quick setup with Neon**

1. Create a new PostgreSQL database at [neon.new/db](https://neon.new/db)
2. Copy the connection string and set it in the `.env` file in the `apps/api` directory:

**Setup:**

1. Create a `.env` file in the `apps/api` directory:
   ```bash
   cd apps/api
   echo "DATABASE_URL=\"your_postgresql_connection_string_here\"" > .env
   ```
2. Generate the Prisma client and push the schema:
   ```bash
   pnpm db:push
   ```
3. Seed the database with sample data (optional but recommended):
   ```bash
   pnpm db:seed
   ```
4. Return to the root and start the development servers:
   ```bash
   cd ../..
   pnpm dev
   ```

- Web app: [http://localhost:3001](http://localhost:3001)
- API: [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
metrifacts/
├── apps/
│   ├── web/                   # Frontend (Next.js)
│   │   └── src/
│   │       ├── app/           # App Router pages & layouts
│   │       ├── components/    # React components
│   │       │   ├── ui/        # Reusable UI components (shadcn/ui)
│   │       │   ├── dashboard.tsx
│   │       │   ├── metric-card.tsx
│   │       │   ├── metric-form.tsx
│   │       │   └── add-entry-form.tsx
│   │       ├── hooks/         # Custom React hooks
│   │       └── lib/           # Utilities & API client
│   └── api/                   # Backend (Hono, Prisma)
│       ├── src/
│       │   ├── routes/        # API route handlers
│       │   ├── middlewares/   # Express-style middleware
│       │   └── lib/           # Utilities & error handling
│       └── prisma/
│           ├── schema/        # Database schema
│           ├── seed.ts        # Sample data generator
│           └── generated/     # Generated Prisma client
```

## Architecture Overview

- **Frontend (`apps/web`)**:  
  Built with Next.js, using React Query for async state management and React Hook Form for form state. Communicates with the backend via a shared API client for type-safe data fetching.

- **Backend (`apps/api`)**:  
  Built with Hono and Prisma, using PostgreSQL database.  
  Exposes REST endpoints for:

  - Creating and retrieving metrics
  - Adding timestamped entries
  - Enforcing data validation with Zod schemas

- **Database**:  
  PostgreSQL with Prisma ORM, designed for flexible metric tracking with categorization.  
  Includes comprehensive seed data with realistic business, user engagement, and performance metrics.

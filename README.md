# Monorepo: NestJS + Next.js + Zod

A pnpm monorepo with shared Zod validation between frontend and backend.

## Structure

```
├── apps/
│   ├── client/    # Next.js + shadcn
│   └── server/    # NestJS + TypeORM
└── packages/
    └── shared/    # Zod schemas + types
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run both apps in development
pnpm dev

# Run individual apps
pnpm dev:client
pnpm dev:server
```

## Key Features

- **Shared Validation**: Zod schemas work on both frontend and backend
- **Type Safety**: Types inferred from schemas - single source of truth
- **Swagger/OpenAPI**: Auto-generated from Zod schemas
- **Form Validation**: react-hook-form with Zod resolver

## Packages

| Package | Description |
|---------|-------------|
| `@repo/shared` | Zod schemas and inferred types |
| `@repo/client` | Next.js frontend with shadcn/ui |
| `@repo/server` | NestJS backend with TypeORM |

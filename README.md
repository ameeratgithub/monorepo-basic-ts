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

Make sure you have docker installed on your system. Run the following command
```bash
docker-compose up -d --build
```

- Client should be up at http://localhost:3000
- Server should be up at http://localhost:3001
- PgAdmin should be up at http://localhost:5051

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

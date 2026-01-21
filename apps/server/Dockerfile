# Build stage
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy everything needed for install
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig.base.json ./

# Copy all packages/apps structure (needed for workspace resolution)
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Install all dependencies
RUN pnpm install

# Build shared package
RUN pnpm --filter @repo/shared build

# Expose port
EXPOSE 3001

# Default command (overridden by docker-compose)
CMD ["pnpm", "--filter", "@repo/server", "dev"]

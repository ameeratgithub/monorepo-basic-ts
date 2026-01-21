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

## Sign into the DB

#### Step 1: open [http://localhost:5051](http://localhost:5051) in your web browser and login using the following credentials: 
```sh
 Username: admin@admin.com
  password: admin
```
#### Step 2: once the login is done, the dashboard appears with server group. Right click the server group and click Register -> Server. A popup appears. 

In the _General_ tab of the popup: 
` in the name section insert "monorepo" `

Then go to _Connection_ tab and insert the following fields: 
```bash
Hostname/Address = #retrieval given below
 Username = devuser
 password = devuserpassword
```

### Hostname/Address :

#### Step 1: To retrieve the Hostname/Address, go to `Docker Desktop` and expand the server, click on the `monorepo-postgres` .

#### Step 2:  Now click on inspect tab. In it, find `NetworkSettings` and in that `Networks`. 

#### Step 3:  In _Networks_  section copy the address of `Gateway`. it will look something like `172.19.0.1` .

Now click Save, you will see the DB Dashboard.

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

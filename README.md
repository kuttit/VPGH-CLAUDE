# Payment Rails API

Multi-Payment Rail SaaS Platform API built with NestJS, Prisma, and PostgreSQL.

## Description

A comprehensive REST API for managing multiple payment rails (FedNow, SWIFT, ACH, SEPA, etc.) with support for:

- Multi-rail payment processing
- Transaction lifecycle management
- Workflow orchestration
- Event streaming and process logging
- Human-in-the-Loop (HITL) interventions
- Validation and routing rules
- Complete audit trail

## Technology Stack

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **API Documentation**: Swagger/OpenAPI 3.0
- **Language**: TypeScript

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL 15+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL connection string
```

## Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (if you have migration files)
npm run prisma:migrate

# Or push schema directly to database
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npm run prisma:studio
```

## Running the Application

```bash
# Development mode with watch
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

The API will be available at:

```
http://localhost:3000/api/v1
```

## Project Structure

```
src/
├── common/
│   └── dto/                    # Common DTOs (pagination, etc.)
├── modules/
│   ├── countries/              # Countries module
│   │   ├── dto/
│   │   ├── countries.controller.ts
│   │   ├── countries.service.ts
│   │   └── countries.module.ts
│   ├── currencies/             # Currencies module
│   ├── payment-rails/          # Payment rails module
│   └── payment-transactions/   # Payment transactions module
├── prisma/
│   ├── prisma.service.ts      # Prisma service
│   └── prisma.module.ts       # Prisma module
├── app.module.ts               # Root module
└── main.ts                     # Application entry point

prisma/
└── schema.prisma              # Prisma schema definition
```

## API Endpoints

### Countries
- `GET /api/v1/countries` - List all countries
- `POST /api/v1/countries` - Create a country
- `GET /api/v1/countries/:id` - Get country by ID
- `GET /api/v1/countries/code/:code` - Get country by code
- `PATCH /api/v1/countries/:id` - Update country
- `DELETE /api/v1/countries/:id` - Delete country
- `GET /api/v1/countries/search?q=query` - Search countries

### Currencies
- `GET /api/v1/currencies` - List all currencies
- `POST /api/v1/currencies` - Create a currency
- `GET /api/v1/currencies/:id` - Get currency by ID
- `GET /api/v1/currencies/code/:code` - Get currency by code
- `PATCH /api/v1/currencies/:id` - Update currency
- `DELETE /api/v1/currencies/:id` - Delete currency
- `GET /api/v1/currencies/search?q=query` - Search currencies

### Payment Rails
- `GET /api/v1/payment-rails` - List all payment rails
- `POST /api/v1/payment-rails` - Create a payment rail
- `GET /api/v1/payment-rails/:id` - Get payment rail by ID
- `GET /api/v1/payment-rails/code/:code` - Get rail by code
- `GET /api/v1/payment-rails/type/:railType` - Get rails by type
- `PATCH /api/v1/payment-rails/:id` - Update payment rail
- `DELETE /api/v1/payment-rails/:id` - Delete payment rail
- `GET /api/v1/payment-rails/search?q=query` - Search payment rails

### Payment Transactions
- `GET /api/v1/payment-transactions` - List all transactions
- `POST /api/v1/payment-transactions` - Create a transaction
- `GET /api/v1/payment-transactions/:id` - Get transaction by ID
- `GET /api/v1/payment-transactions/ref/:ref` - Get transaction by reference
- `GET /api/v1/payment-transactions/:id/journey` - Get transaction journey
- `GET /api/v1/payment-transactions/suspicious` - Get suspicious transactions
- `GET /api/v1/payment-transactions/requiring-hitl` - Get transactions requiring HITL
- `PATCH /api/v1/payment-transactions/:id` - Update transaction
- `DELETE /api/v1/payment-transactions/:id` - Delete transaction

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| NODE_ENV | Environment (development/production) | development |
| PORT | Application port | 3000 |
| API_PREFIX | API path prefix | api/v1 |
| SWAGGER_ENABLED | Enable Swagger documentation | true |
| CORS_ORIGIN | CORS origin | * |

## Database Schema

The database schema includes:

- **Master Tables**: Countries, Currencies
- **Payment Rails**: Payment rails, products, countries, currencies mappings
- **Workflows**: Workflow definitions, steps, transitions
- **Validation & Routing**: Validation rules, routing rules
- **Transactions**: Payment transactions, transaction parties
- **Process Logs**: Payment process logs, error logs
- **HITL**: HITL interventions, audit trail
- **Configuration**: System configuration, fee configuration
- **Audit**: General audit trail

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format
```

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

## Docker Support

Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: payment_rails
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

## OpenAPI/Swagger Export

Export OpenAPI specification:

```bash
# Start the application
npm run start:dev

# Access the JSON specification at:
# http://localhost:3000/api/docs-json
```

## License

MIT

## Support

For support, email support@example.com or create an issue in the repository.

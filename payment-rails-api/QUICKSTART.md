# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ running (or use Docker)

## Step 1: Clone/Navigate to Project

```bash
cd payment-rails-api
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Setup Database

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Wait for PostgreSQL to be ready (about 10 seconds)
```

### Option B: Use Existing PostgreSQL

Skip this if you're using Docker. Make sure PostgreSQL is running on your machine.

## Step 4: Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env and update DATABASE_URL if needed
# Default: postgresql://postgres:password@localhost:5432/payment_rails?schema=public
```

## Step 5: Initialize Database

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npm run prisma:generate
```

## Step 6: Start the API

```bash
# Start in development mode
npm run start:dev
```

Wait for the message:
```
🚀 Application is running on: http://localhost:3000/api/v1
📚 API Documentation: http://localhost:3000/api/docs
```

## Step 7: Access Swagger Documentation

Open your browser and navigate to:
```
http://localhost:3000/api/docs
```

## Step 8: Test the API

### Create a Country

```bash
curl -X POST http://localhost:3000/api/v1/countries \
  -H "Content-Type: application/json" \
  -d '{
    "countryCode": "USA",
    "countryCodeAlpha2": "US",
    "countryName": "United States",
    "numericCode": "840",
    "region": "Americas",
    "subRegion": "Northern America"
  }'
```

### Create a Currency

```bash
curl -X POST http://localhost:3000/api/v1/currencies \
  -H "Content-Type: application/json" \
  -d '{
    "currencyCode": "USD",
    "currencyName": "US Dollar",
    "numericCode": "840",
    "minorUnits": 2,
    "symbol": "$"
  }'
```

### Create a Payment Rail

```bash
curl -X POST http://localhost:3000/api/v1/payment-rails \
  -H "Content-Type: application/json" \
  -d '{
    "railCode": "FEDNOW",
    "railName": "FedNow Service",
    "railDescription": "Federal Reserve Instant Payment Service",
    "railType": "REAL_TIME",
    "operatorName": "Federal Reserve",
    "isRealTime": true,
    "is24x7": true,
    "settlementType": "INSTANT",
    "messageFormat": "ISO20022"
  }'
```

### Get All Countries

```bash
curl http://localhost:3000/api/v1/countries
```

## Useful Commands

```bash
# View database in Prisma Studio
npm run prisma:studio

# Generate Prisma Client after schema changes
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# View logs
# (logs appear in terminal where you ran start:dev)

# Stop Docker services
docker-compose down

# Stop and remove data
docker-compose down -v
```

## Troubleshooting

### Port 3000 already in use
```bash
# Change PORT in .env file
PORT=3001
```

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- If using Docker: `docker-compose ps` should show postgres as healthy

### Prisma Client not found
```bash
npm run prisma:generate
```

### Module not found errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Explore the API documentation at http://localhost:3000/api/docs
2. Review the schema at `prisma/schema.prisma`
3. Add more entities (Payment Products, Workflows, etc.)
4. Implement authentication and authorization
5. Add integration tests
6. Deploy to production

## API Endpoints Summary

| Resource | Endpoint | Methods |
|----------|----------|---------|
| Countries | /api/v1/countries | GET, POST, PATCH, DELETE |
| Currencies | /api/v1/currencies | GET, POST, PATCH, DELETE |
| Payment Rails | /api/v1/payment-rails | GET, POST, PATCH, DELETE |
| Payment Transactions | /api/v1/payment-transactions | GET, POST, PATCH, DELETE |

For detailed API documentation, visit http://localhost:3000/api/docs

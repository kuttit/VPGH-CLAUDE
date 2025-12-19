# API Testing Guide - PayFlow Global Payment HUB

## Overview
This guide provides sample API calls to test the seeded FedNow data in the PayFlow Global Payment HUB.

## Base URL
```
http://localhost:3000/api/v1
```

## Swagger UI
Interactive API documentation and testing:
```
http://localhost:3000/api/docs
```

---

## 1. Master Data APIs

### Countries

#### Get All Countries
```bash
curl http://localhost:3000/api/v1/countries
```

**Expected Response:**
- 1 country (USA)
- Country Code: USA
- Alpha-2: US

#### Get Country by ID
```bash
# Replace {id} with actual country ID from previous call
curl http://localhost:3000/api/v1/countries/{id}
```

#### Get Country by Code
```bash
curl http://localhost:3000/api/v1/countries/code/USA
```

#### Search Countries
```bash
curl "http://localhost:3000/api/v1/countries/search?q=United"
```

### Currencies

#### Get All Currencies
```bash
curl http://localhost:3000/api/v1/currencies
```

**Expected Response:**
- 1 currency (USD)
- Symbol: $
- Minor Units: 2

#### Get Currency by Code
```bash
curl http://localhost:3000/api/v1/currencies/code/USD
```

#### Search Currencies
```bash
curl "http://localhost:3000/api/v1/currencies/search?q=Dollar"
```

---

## 2. Payment Rails APIs

### Get All Payment Rails
```bash
curl http://localhost:3000/api/v1/payment-rails
```

**Expected Response:**
- 1 rail (FedNow)
- Rail Code: FEDNOW
- Is Real-time: true
- Is 24x7: true

### Get FedNow by Code
```bash
curl http://localhost:3000/api/v1/payment-rails/code/FEDNOW
```

**Key Fields to Verify:**
- `railName`: "FedNow Service"
- `isRealTime`: true
- `is24x7`: true
- `maxAmount`: 500000.00
- `messageFormat`: "ISO20022"
- `paymentProducts`: Array of 3 products

### Get FedNow by ID
```bash
# Replace {id} with FedNow rail ID
curl http://localhost:3000/api/v1/payment-rails/{id}
```

**This endpoint includes:**
- Complete rail configuration
- All 3 payment products
- Country mappings
- Currency mappings

### Get Rails by Type
```bash
curl http://localhost:3000/api/v1/payment-rails/type/REAL_TIME
```

### Search Payment Rails
```bash
curl "http://localhost:3000/api/v1/payment-rails/search?q=FedNow"
curl "http://localhost:3000/api/v1/payment-rails/search?q=Federal"
```

### Filter by Active Status
```bash
curl "http://localhost:3000/api/v1/payment-rails?isActive=true"
```

---

## 3. Payment Transactions APIs

### Get All Transactions
```bash
curl http://localhost:3000/api/v1/payment-transactions
```

**Expected Response:**
- 2 transactions
- Transaction 1: Completed salary payment ($1,500)
- Transaction 2: Processing supplier payment ($25,000)

### Get Transaction by ID
```bash
# Replace {id} with transaction ID
curl http://localhost:3000/api/v1/payment-transactions/{id}
```

**This endpoint includes:**
- Complete transaction details
- Payment rail information
- Product information
- Currency information
- Transaction parties (debtor/creditor)
- Process logs
- Error logs (if any)
- HITL interventions (if any)

### Get Transaction by Reference
```bash
curl http://localhost:3000/api/v1/payment-transactions/ref/FN-20231215-0000001
curl http://localhost:3000/api/v1/payment-transactions/ref/FN-20231215-0000002
```

### Get Transaction Journey
```bash
# Shows complete processing history
curl http://localhost:3000/api/v1/payment-transactions/{id}/journey
```

**Expected Response:**
- Transaction summary
- Array of process logs in sequence
- Each log entry shows:
  - Step executed
  - Status
  - Duration
  - Timestamp

### Filter Transactions

#### By Status
```bash
curl "http://localhost:3000/api/v1/payment-transactions?status=COMPLETED"
curl "http://localhost:3000/api/v1/payment-transactions?status=PROCESSING"
```

#### By Direction
```bash
curl "http://localhost:3000/api/v1/payment-transactions?direction=OUTBOUND"
```

#### By Rail
```bash
# Replace {railId} with FedNow rail ID
curl "http://localhost:3000/api/v1/payment-transactions?railId={railId}"
```

#### Pagination
```bash
curl "http://localhost:3000/api/v1/payment-transactions?page=1&limit=10"
```

### Get Suspicious Transactions
```bash
curl http://localhost:3000/api/v1/payment-transactions/suspicious
```

**Expected Response:**
- 0 transactions (none marked as suspicious in seed data)

### Get Transactions Requiring HITL
```bash
curl http://localhost:3000/api/v1/payment-transactions/requiring-hitl
```

**Expected Response:**
- 0 transactions (none require HITL in seed data)

---

## 4. Create New Transaction

### Example: Create FedNow Credit Transfer

```bash
curl -X POST http://localhost:3000/api/v1/payment-transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionRef": "FN-20231215-0000003",
    "endToEndId": "PFGH-E2E-20231215-003",
    "instructionId": "PFGH-INSTR-20231215-003",
    "railId": "REPLACE_WITH_FEDNOW_RAIL_ID",
    "productId": "REPLACE_WITH_PRODUCT_ID",
    "direction": "OUTBOUND",
    "instructedAmount": 5000.00,
    "instructedCurrencyId": "REPLACE_WITH_USD_ID",
    "purposeCode": "SUPP",
    "purposeDescription": "Supplier Payment",
    "remittanceInfo": "Invoice INV-2023-67890",
    "chargesAmount": 0.045,
    "chargeBearer": "SLEV"
  }'
```

**To get required IDs:**
```bash
# Get FedNow Rail ID
curl http://localhost:3000/api/v1/payment-rails/code/FEDNOW | grep '"id"'

# Get Product ID
curl http://localhost:3000/api/v1/payment-rails/code/FEDNOW | grep '"productCode":"FN-CREDIT-TRANSFER"' -A 1

# Get USD Currency ID
curl http://localhost:3000/api/v1/currencies/code/USD | grep '"id"'
```

---

## 5. Complete Testing Workflow

### Step 1: Verify Master Data
```bash
# Check countries
curl http://localhost:3000/api/v1/countries

# Check currencies
curl http://localhost:3000/api/v1/currencies
```

### Step 2: Verify FedNow Configuration
```bash
# Get FedNow rail with all details
curl http://localhost:3000/api/v1/payment-rails/code/FEDNOW | json_pp
```

**Verify:**
- ✅ 3 Payment Products
- ✅ Rail is active
- ✅ Real-time enabled
- ✅ 24/7 operation
- ✅ Amount limits ($0.01 - $500,000)

### Step 3: Verify Transactions
```bash
# Get all transactions
curl http://localhost:3000/api/v1/payment-transactions

# Get transaction journey for completed transaction
curl http://localhost:3000/api/v1/payment-transactions/ref/FN-20231215-0000001 | json_pp
```

### Step 4: Test Transaction Journey
```bash
# Get the completed transaction
COMPLETED_TXN=$(curl -s http://localhost:3000/api/v1/payment-transactions/ref/FN-20231215-0000001 | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# View its journey
curl http://localhost:3000/api/v1/payment-transactions/$COMPLETED_TXN/journey | json_pp
```

---

## 6. Verification Checklist

### Master Data
- [x] USA country exists
- [x] USD currency exists
- [x] All fields populated correctly

### FedNow Rail
- [x] FedNow rail exists with code FEDNOW
- [x] 3 payment products configured
  - [x] FN-CREDIT-TRANSFER
  - [x] FN-REQUEST-FOR-PAYMENT
  - [x] FN-PAYMENT-RETURN
- [x] Rail mapped to USA
- [x] Rail mapped to USD
- [x] Real-time: true
- [x] 24x7: true
- [x] ISO20022 message format

### Workflow
- [x] Outbound credit transfer workflow exists
- [x] 7 workflow steps configured
- [x] Transitions defined
- [x] HITL configuration present

### Validation & Routing
- [x] 5 validation rules created
- [x] 1 routing rule (US domestic instant)
- [x] Amount limits enforced
- [x] Format validations present

### Configuration
- [x] 8 system configuration settings
- [x] 3 fee configurations
- [x] All active and valid

### Sample Data
- [x] 2 sample transactions
  - [x] 1 completed ($1,500 salary)
  - [x] 1 processing ($25,000 supplier)
- [x] 4 transaction parties
- [x] 2 process log entries

---

## 7. Response Format Examples

### Success Response
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2",
  ...
}
```

### Paginated Response
```json
{
  "data": [ ... ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

---

## 8. Testing with Postman

1. Import OpenAPI spec from:
   ```
   http://localhost:3000/api/docs-json
   ```

2. Or manually create collection with above endpoints

3. Set environment variable:
   ```
   BASE_URL = http://localhost:3000/api/v1
   ```

---

## 9. Testing with Swagger UI

1. Open browser: http://localhost:3000/api/docs

2. Explore endpoints by category:
   - Countries
   - Currencies
   - Payment Rails
   - Payment Transactions

3. Click "Try it out" on any endpoint

4. Modify parameters if needed

5. Click "Execute"

6. View response with status code and body

---

## 10. Automated Verification

### Windows
```bash
cd C:\Users\Administrator\Downloads\VGPH_SeedDataV3\payment-rails-api
verify-seed-data.bat
```

### Linux/Mac
```bash
cd /path/to/payment-rails-api
chmod +x verify-seed-data.sh
./verify-seed-data.sh
```

---

## 11. Database Verification

### Using Prisma Studio
```bash
npm run prisma:studio
```

Then open: http://localhost:5555

**Tables to Verify:**
- countries (1 row)
- currencies (1 row)
- payment_rails (1 row)
- payment_products (3 rows)
- payment_rail_countries (1 row)
- payment_rail_currencies (1 row)
- workflow_definitions (1 row)
- workflow_steps (7 rows)
- workflow_step_transitions (8 rows)
- validation_rules (5 rows)
- routing_rules (1 row)
- system_configuration (8 rows)
- fee_configuration (3 rows)
- payment_transactions (2 rows)
- transaction_parties (4 rows)
- payment_process_logs (2 rows)

---

## 12. Performance Testing

### Response Time
```bash
time curl http://localhost:3000/api/v1/payment-rails/code/FEDNOW
```

**Expected:** < 100ms

### Load Test (Simple)
```bash
for i in {1..100}; do
  curl -s http://localhost:3000/api/v1/payment-transactions > /dev/null
done
```

---

## Support

- **API Documentation**: http://localhost:3000/api/docs
- **Seed Data Summary**: See SEED_DATA_SUMMARY.md
- **Project Documentation**: See README.md

---

**Last Updated:** December 2024
**Platform:** PayFlow Global Payment HUB
**Focus:** FedNow - US Instant Payments

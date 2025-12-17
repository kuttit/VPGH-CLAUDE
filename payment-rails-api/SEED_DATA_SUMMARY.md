# Seed Data Summary - PayFlow Global Payment HUB

## Overview
This document describes the seed data loaded into the PayFlow Global Payment HUB database, focused on **FedNow** rail for **US Payments**.

## Seed Data Created

### 1. Countries (1 entry)
- **USA** (United States)
  - Country Code: USA
  - Alpha-2 Code: US
  - Numeric Code: 840
  - Region: Americas
  - Sub-region: Northern America

### 2. Currencies (1 entry)
- **USD** (US Dollar)
  - Currency Code: USD
  - Numeric Code: 840
  - Minor Units: 2 (cents)
  - Symbol: $

### 3. Payment Rail (1 entry)
**FedNow Service**
- Rail Code: `FEDNOW`
- Rail Type: REAL_TIME
- Operator: Federal Reserve Banks
- Operating Hours: 24/7/365
- Settlement Type: INSTANT
- Amount Range: $0.01 - $500,000.00
- Message Format: ISO20022
- Active: Yes

**Configuration:**
- Service Type: Instant Payment
- Settlement: Real-time
- Supported Messages: pacs.008, pacs.002, pacs.004, camt.056
- Batch Processing: No
- Supports Request for Payment: Yes
- Supports Return: Yes
- Max Return Days: 1

**API Configuration:**
- Base URL: https://api.fednow.gov/v1
- Authentication: OAuth2
- Timeout: 30 seconds
- Retry Count: 3

**Security:**
- Encryption: AES-256-GCM
- Signing: RSA-SHA256
- TLS Version: 1.3
- Message Auth: HMAC-SHA256

### 4. Payment Products (3 entries)

#### 4.1 FedNow Credit Transfer
- Product Code: `FN-CREDIT-TRANSFER`
- Type: CREDIT_TRANSFER
- Instant: Yes
- Amount Range: $0.01 - $500,000.00
- Fee: $0.045 per transaction
- Message Type: pacs.008.001.08
- Use Cases: P2P, B2B, B2C, payroll, bill payment

#### 4.2 FedNow Request for Payment
- Product Code: `FN-REQUEST-FOR-PAYMENT`
- Type: REQUEST_FOR_PAYMENT
- Instant: Yes
- Amount Range: $0.01 - $500,000.00
- Fee: $0.015 per request
- Message Type: pain.013.001.07
- Expiry: 72 hours
- Use Cases: invoicing, bill payment, account receivable

#### 4.3 FedNow Payment Return
- Product Code: `FN-PAYMENT-RETURN`
- Type: RETURN
- Instant: Yes
- Amount Range: $0.01 - $500,000.00
- Fee: $0.045 per return
- Message Type: pacs.004.001.09
- Return Window: 24 hours
- Use Cases: incorrect account, duplicate payment, fraud prevention

### 5. Payment Rail Mappings

#### Countries
- FedNow → USA (Domestic)
  - Effective From: 2023-07-20
  - Regulatory Framework: Federal Reserve Act
  - Operating Rules: FedNow Service Operating Rules

#### Currencies
- FedNow → USD (Primary)
  - Settlement Currency: USD
  - FX Support: No

### 6. Workflow Definition (1 entry)

**FedNow Outbound Credit Transfer Workflow**
- Workflow Code: `FN-OUTBOUND-CT`
- Direction: OUTBOUND
- Default: Yes
- Active: Yes

**Configuration:**
- Async Processing: No
- Notifications: Enabled (email, webhook)
- Max Retries: 3
- Retry Delay: 60s (exponential backoff)
- Workflow Timeout: 60 minutes
- Step Timeout: 5 minutes

**HITL Configuration:**
- Enabled: Yes
- Auto Escalation: 30 minutes
- Approval Required For: Suspicious, Error, Amount > $100,000

### 7. Workflow Steps (7 steps)

1. **VALIDATE** - Validate Payment Request
   - Type: VALIDATION
   - Mandatory: Yes
   - Validates: format, business rules, amount, account

2. **FRAUD_CHECK** - Fraud Detection Check
   - Type: FRAUD_CHECK
   - Mandatory: Yes
   - HITL Checkpoint: Yes
   - Risk Threshold: 0.7
   - Triggers: SUSPICIOUS, HIGH_RISK

3. **COMPLIANCE_CHECK** - AML/Compliance Screening
   - Type: COMPLIANCE_CHECK
   - Mandatory: Yes
   - HITL Checkpoint: Yes
   - Screens: OFAC, EU Sanctions, UN Sanctions
   - Triggers: MATCH_FOUND, COMPLIANCE_REVIEW

4. **TRANSFORM** - Transform to ISO20022
   - Type: TRANSFORMATION
   - Mandatory: Yes
   - Target Format: pacs.008.001.08

5. **SUBMIT** - Submit to FedNow
   - Type: SUBMISSION
   - Mandatory: Yes
   - Timeout: 30 seconds
   - Retries: 3

6. **ACKNOWLEDGE** - Process Acknowledgment
   - Type: ACKNOWLEDGMENT
   - Mandatory: Yes
   - Async: Yes
   - Timeout: 2 minutes
   - Triggers: TIMEOUT, NEGATIVE_ACK

7. **NOTIFY** - Send Notifications
   - Type: NOTIFICATION
   - Mandatory: No
   - Async: Yes
   - Channels: email, webhook, sms

### 8. Workflow Transitions (8 transitions)
Complete state machine connecting all steps from START → VALIDATE → FRAUD_CHECK → COMPLIANCE_CHECK → TRANSFORM → SUBMIT → ACKNOWLEDGE → NOTIFY → END

### 9. Validation Rules (5 rules)

1. **FN-AMOUNT-LIMIT**
   - Category: LIMIT
   - Rule: Amount between $0.01 and $500,000.00
   - Blocking: Yes

2. **FN-ACCOUNT-FORMAT**
   - Category: FORMAT
   - Rule: Account number 6-17 digits
   - Blocking: Yes

3. **FN-ROUTING-NUMBER**
   - Category: FORMAT
   - Rule: Routing number 9 digits
   - Blocking: Yes

4. **FN-BUSINESS-HOURS**
   - Category: BUSINESS
   - Rule: Always passes (24/7/365)
   - Blocking: No

5. **FN-DUPLICATE-CHECK**
   - Category: BUSINESS
   - Rule: Unique end-to-end ID within 24 hours
   - Blocking: Yes

### 10. Routing Rules (1 entry)

**US-DOMESTIC-INSTANT**
- Priority: 100
- Conditions:
  - Country From: USA
  - Country To: USA
  - Currency: USD
  - Amount: $0.01 - $500,000.00
  - Payment Type: INSTANT
- Target: FedNow Credit Transfer
- Effective From: 2023-07-20

### 11. System Configuration (8 settings)

1. **PLATFORM_NAME**: PayFlow Global Payment HUB
2. **PLATFORM_VERSION**: 1.0.0
3. **FEDNOW_ENABLED**: true
4. **MAX_TRANSACTION_AMOUNT_USD**: 500000.00
5. **FRAUD_DETECTION_ENABLED**: true
6. **HITL_AUTO_ESCALATION_MINUTES**: 30
7. **NOTIFICATION_EMAIL_ENABLED**: true
8. **AUDIT_LOG_RETENTION_DAYS**: 2555 (7 years)

### 12. Fee Configuration (3 entries)

1. **FN-CT-STANDARD** - FedNow Credit Transfer
   - Type: FLAT
   - Amount: $0.045

2. **FN-RFP-STANDARD** - FedNow Request for Payment
   - Type: FLAT
   - Amount: $0.015

3. **FN-RETURN-STANDARD** - FedNow Payment Return
   - Type: FLAT
   - Amount: $0.045

### 13. Sample Payment Transactions (2 entries)

#### Transaction 1: Completed Salary Payment
- Reference: `FN-20231215-0000001`
- End-to-End ID: `PFGH-E2E-20231215-001`
- Direction: OUTBOUND
- Status: COMPLETED
- Amount: $1,500.00 USD
- Purpose: Salary Payment (SALA)
- Debtor: PayFlow Global Inc (JPMorgan Chase)
- Creditor: John Doe (Bank of America)
- Processing Time: 850ms
- Fee: $0.045

#### Transaction 2: In-Progress Supplier Payment
- Reference: `FN-20231215-0000002`
- End-to-End ID: `PFGH-E2E-20231215-002`
- Direction: OUTBOUND
- Status: PROCESSING
- Amount: $25,000.00 USD
- Purpose: Supplier Payment (SUPP)
- Debtor: PayFlow Global Inc (JPMorgan Chase)
- Creditor: ABC Supplies LLC (Wells Fargo)
- Current Step: Submit to FedNow
- Fee: $0.045

### 14. Transaction Parties (4 entries)

**PayFlow Global Inc** (Debtor - 2 transactions)
- Account: 1234567890 (CHECKING)
- Bank: JPMorgan Chase Bank
- Routing: 021000021
- BIC: CHASUS33
- Location: New York, NY 10001

**John Doe** (Creditor - Transaction 1)
- Account: 9876543210 (SAVINGS)
- Bank: Bank of America
- Routing: 111000025
- BIC: BOFAUS3N
- Location: Los Angeles, CA 90001

**ABC Supplies LLC** (Creditor - Transaction 2)
- Account: 5555666677 (CHECKING)
- Bank: Wells Fargo Bank
- Routing: 026009593
- BIC: WFBIUS6S
- Location: Chicago, IL 60601

### 15. Payment Process Logs (2 entries)

**Transaction 1 Process Logs:**
1. Validation Started - Status: IN_PROGRESS
2. Validation Completed - Status: SUCCESS, Duration: 250ms
   - Checks Passed: format, amount, account

## Database Schema Compliance

All seed data complies with:
- ✅ Foreign key constraints
- ✅ Unique constraints
- ✅ Data type requirements
- ✅ Enum validations
- ✅ Default values
- ✅ JSONB field structures

## Testing the Seed Data

### Via Swagger UI
Access: http://localhost:3000/api/docs

### Via cURL

```bash
# Get FedNow Rail
curl http://localhost:3000/api/v1/payment-rails/code/FEDNOW

# Get All Countries
curl http://localhost:3000/api/v1/countries

# Get All Transactions
curl http://localhost:3000/api/v1/payment-transactions

# Get Transaction Journey
curl http://localhost:3000/api/v1/payment-transactions/{id}/journey
```

### Via Prisma Studio

```bash
npm run prisma:studio
```

Then navigate to http://localhost:5555

## Use Cases Demonstrated

1. **Instant Payment Processing**
   - Complete workflow from validation to settlement
   - Real-time fraud detection and compliance screening
   - ISO20022 message transformation

2. **Human in the Loop (HITL)**
   - Fraud checkpoint for suspicious transactions
   - Compliance review for watchlist matches
   - Amount threshold approvals ($100,000+)

3. **Multi-Step Workflow**
   - 7-step processing pipeline
   - Conditional execution based on outcomes
   - Retry policies and error handling

4. **Payment Products**
   - Credit Transfer (instant payments)
   - Request for Payment (invoicing)
   - Payment Returns (corrections)

5. **Validation & Routing**
   - Format validation (account, routing numbers)
   - Amount limits enforcement
   - Intelligent routing based on conditions

6. **Audit & Compliance**
   - Complete transaction journey logging
   - Process event streaming
   - 7-year audit retention

## Next Steps

1. **Add More Sample Data**
   - Additional transactions with different statuses
   - Error scenarios and HITL interventions
   - Various payment types and amounts

2. **Test Workflows**
   - Submit new transactions via API
   - Monitor workflow execution
   - Test HITL interventions

3. **Extend Coverage**
   - Add more payment rails (ACH, SWIFT, SEPA)
   - Additional countries and currencies
   - More complex routing scenarios

4. **Integration Testing**
   - End-to-end transaction processing
   - Webhook notifications
   - Error handling and recovery

## Summary

The seed data provides a **complete, production-ready configuration** for FedNow-based instant payments within the PayFlow Global Payment HUB platform. All data maintains referential integrity and follows the schema constraints defined in the DDL.

**Key Metrics:**
- 📊 20+ Tables Populated
- 🏦 1 Payment Rail (FedNow)
- 📦 3 Payment Products
- ⚙️ 1 Complete Workflow (7 steps)
- ✅ 5 Validation Rules
- 💳 2 Sample Transactions
- 🔐 Full Compliance & Audit Trail

---

Generated: December 2024
Platform: PayFlow Global Payment HUB
Focus: FedNow - US Instant Payments

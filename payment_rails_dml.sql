-- ============================================================================
-- MULTI-PAYMENT RAIL SAAS PLATFORM - DML SCRIPT (SEED DATA)
-- Focus: FedNow Payment Rail for USA
-- Description: Complete seed data for FedNow implementation
-- ============================================================================

-- ============================================================================
-- SECTION 1: REFERENCE DATA - COUNTRIES
-- ============================================================================

INSERT INTO countries (country_id, country_code, country_code_alpha2, country_name, numeric_code, region, sub_region, is_active, metadata)
VALUES
    ('11111111-1111-1111-1111-111111111001', 'USA', 'US', 'United States of America', '840', 'Americas', 'Northern America', TRUE, 
     '{"timezone": "America/New_York", "default_locale": "en-US", "date_format": "MM/DD/YYYY"}'),
    ('11111111-1111-1111-1111-111111111002', 'CAN', 'CA', 'Canada', '124', 'Americas', 'Northern America', TRUE, 
     '{"timezone": "America/Toronto", "default_locale": "en-CA"}'),
    ('11111111-1111-1111-1111-111111111003', 'GBR', 'GB', 'United Kingdom', '826', 'Europe', 'Northern Europe', TRUE, 
     '{"timezone": "Europe/London", "default_locale": "en-GB"}'),
    ('11111111-1111-1111-1111-111111111004', 'DEU', 'DE', 'Germany', '276', 'Europe', 'Western Europe', TRUE, 
     '{"timezone": "Europe/Berlin", "default_locale": "de-DE"}'),
    ('11111111-1111-1111-1111-111111111005', 'FRA', 'FR', 'France', '250', 'Europe', 'Western Europe', TRUE, 
     '{"timezone": "Europe/Paris", "default_locale": "fr-FR"}'),
    ('11111111-1111-1111-1111-111111111006', 'IND', 'IN', 'India', '356', 'Asia', 'Southern Asia', TRUE, 
     '{"timezone": "Asia/Kolkata", "default_locale": "en-IN"}'),
    ('11111111-1111-1111-1111-111111111007', 'MEX', 'MX', 'Mexico', '484', 'Americas', 'Central America', TRUE, 
     '{"timezone": "America/Mexico_City", "default_locale": "es-MX"}');

-- ============================================================================
-- SECTION 2: REFERENCE DATA - CURRENCIES
-- ============================================================================

INSERT INTO currencies (currency_id, currency_code, currency_name, numeric_code, minor_units, symbol, is_active, metadata)
VALUES
    ('22222222-2222-2222-2222-222222222001', 'USD', 'US Dollar', '840', 2, '$', TRUE, 
     '{"is_major_currency": true, "decimal_separator": ".", "thousand_separator": ","}'),
    ('22222222-2222-2222-2222-222222222002', 'EUR', 'Euro', '978', 2, '€', TRUE, 
     '{"is_major_currency": true}'),
    ('22222222-2222-2222-2222-222222222003', 'GBP', 'British Pound', '826', 2, '£', TRUE, 
     '{"is_major_currency": true}'),
    ('22222222-2222-2222-2222-222222222004', 'CAD', 'Canadian Dollar', '124', 2, 'C$', TRUE, 
     '{"is_major_currency": true}'),
    ('22222222-2222-2222-2222-222222222005', 'INR', 'Indian Rupee', '356', 2, '₹', TRUE, 
     '{"is_major_currency": true}'),
    ('22222222-2222-2222-2222-222222222006', 'MXN', 'Mexican Peso', '484', 2, 'MX$', TRUE, 
     '{"is_major_currency": false}');

-- ============================================================================
-- SECTION 3: FEDNOW PAYMENT RAIL CONFIGURATION
-- ============================================================================

INSERT INTO payment_rails (
    rail_id, rail_code, rail_name, rail_description, rail_type,
    operator_name, operator_country_id, is_real_time, is_24x7,
    settlement_type, max_amount, min_amount, cutoff_time, timezone,
    message_format, version, is_active,
    rail_config, api_config, security_config, metadata, created_by
)
VALUES (
    '33333333-3333-3333-3333-333333333001',
    'FEDNOW',
    'FedNow Service',
    'The Federal Reserve instant payment service enabling financial institutions to send and receive payments in real-time, 24/7/365',
    'REAL_TIME',
    'Federal Reserve Banks',
    '11111111-1111-1111-1111-111111111001',  -- USA
    TRUE,
    TRUE,
    'INSTANT',
    500000.00,  -- $500,000 max per transaction
    0.01,
    NULL,  -- 24x7 so no cutoff
    'America/New_York',
    'ISO20022',
    '1.0',
    TRUE,
    -- rail_config: FedNow specific configuration
    '{
        "service_participant_prefix": "FN",
        "supported_message_types": ["pacs.008", "pacs.028", "camt.056", "pain.013", "pain.014"],
        "instant_payment_type": "INST",
        "clearing_system_id": "USABA",
        "settlement_method": "CLRG",
        "local_instrument_code": "INST",
        "service_level_code": "INST",
        "category_purpose": "CASH",
        "charge_bearer": "SLEV",
        "remittance_info_max_length": 140,
        "end_to_end_id_max_length": 35,
        "uetr_required": true,
        "duplicate_check_window_hours": 24,
        "positive_response_window_seconds": 20,
        "liquidity_management": {
            "enabled": true,
            "balance_check_required": true,
            "credit_limit_check": true
        },
        "rtp_interoperability": {
            "enabled": false,
            "rtp_participant_directory": null
        }
    }',
    -- api_config: Connection and API settings
    '{
        "base_url": "https://fednow.frb.org/api/v1",
        "auth_type": "CERTIFICATE",
        "connection_timeout_ms": 5000,
        "read_timeout_ms": 20000,
        "max_retries": 3,
        "retry_delay_ms": 1000,
        "bulk_limit": 1,
        "rate_limit_per_second": 100,
        "endpoints": {
            "send_payment": "/payments/credit-transfer",
            "payment_status": "/payments/{uetr}/status",
            "request_for_payment": "/payments/request-for-payment",
            "return_payment": "/payments/return",
            "participant_directory": "/directory/participants"
        },
        "webhook_config": {
            "enabled": true,
            "status_update_url": "/webhooks/fednow/status",
            "acknowledgment_url": "/webhooks/fednow/ack"
        }
    }',
    -- security_config: Security settings
    '{
        "encryption_algorithm": "AES-256-GCM",
        "signing_algorithm": "RS256",
        "certificate_type": "X509",
        "mutual_tls_required": true,
        "certificate_path": "/certs/fednow/client.pem",
        "private_key_path": "/certs/fednow/client.key",
        "ca_bundle_path": "/certs/fednow/ca-bundle.pem",
        "message_signing_required": true,
        "signature_validation_required": true,
        "pki_provider": "FedPKI",
        "audit_logging_enabled": true
    }',
    -- metadata
    '{
        "go_live_date": "2023-07-20",
        "documentation_url": "https://www.frbservices.org/financial-services/fednow",
        "support_contact": "fednow-support@frb.org",
        "compliance_standards": ["ISO 20022", "FFIEC", "PCI-DSS"],
        "participant_count": 900,
        "average_settlement_time_seconds": 3
    }',
    'SYSTEM'
);

-- ============================================================================
-- SECTION 4: FEDNOW PAYMENT PRODUCTS
-- ============================================================================

-- Product 1: Instant Credit Transfer (Core FedNow Payment)
INSERT INTO payment_products (
    product_id, rail_id, product_code, product_name, product_description,
    product_type, is_instant, requires_response, max_amount, min_amount,
    fee_structure, product_config, validation_rules, is_active, created_by
)
VALUES (
    '44444444-4444-4444-4444-444444444001',
    '33333333-3333-3333-3333-333333333001',
    'FEDNOW_ICT',
    'FedNow Instant Credit Transfer',
    'Real-time credit transfer through FedNow Service - pacs.008 message',
    'CREDIT_TRANSFER',
    TRUE,
    TRUE,
    500000.00,
    0.01,
    '{
        "fee_type": "FLAT",
        "base_fee": 0.045,
        "currency": "USD",
        "fee_bearer": "DEBTOR"
    }',
    '{
        "message_type": "pacs.008.001.08",
        "business_service": "FNCTSVC",
        "payment_type_info": {
            "instruction_priority": "HIGH",
            "service_level": "INST",
            "local_instrument": "INST",
            "category_purpose": "CASH"
        },
        "settlement_info": {
            "settlement_method": "CLRG",
            "clearing_system": "USABA"
        },
        "required_fields": [
            "debtor_name", "debtor_account", "debtor_agent_bic",
            "creditor_name", "creditor_account", "creditor_agent_bic",
            "amount", "currency", "end_to_end_id"
        ],
        "optional_fields": [
            "purpose_code", "remittance_info", "ultimate_debtor", "ultimate_creditor"
        ],
        "response_timeout_seconds": 20,
        "acknowledgment_required": true
    }',
    '{
        "amount": {
            "min": 0.01,
            "max": 500000,
            "decimal_places": 2
        },
        "currency": {
            "allowed": ["USD"]
        },
        "account_format": {
            "pattern": "^[0-9]{4,17}$",
            "type": "ROUTING_ACCOUNT"
        },
        "routing_number": {
            "pattern": "^[0-9]{9}$",
            "aba_validation": true
        },
        "end_to_end_id": {
            "max_length": 35,
            "pattern": "^[A-Za-z0-9\\-\\/\\?:\\(\\)\\.,'\\+ ]{1,35}$"
        }
    }',
    TRUE,
    'SYSTEM'
);

-- Product 2: Request for Payment (RfP)
INSERT INTO payment_products (
    product_id, rail_id, product_code, product_name, product_description,
    product_type, is_instant, requires_response, max_amount, min_amount,
    fee_structure, product_config, validation_rules, is_active, created_by
)
VALUES (
    '44444444-4444-4444-4444-444444444002',
    '33333333-3333-3333-3333-333333333001',
    'FEDNOW_RFP',
    'FedNow Request for Payment',
    'Request for Payment through FedNow Service - pain.013 message',
    'REQUEST_FOR_PAYMENT',
    TRUE,
    TRUE,
    500000.00,
    0.01,
    '{
        "fee_type": "FLAT",
        "base_fee": 0.035,
        "currency": "USD",
        "fee_bearer": "CREDITOR"
    }',
    '{
        "message_type": "pain.013.001.07",
        "business_service": "FNRFPSVC",
        "payment_type_info": {
            "instruction_priority": "NORM",
            "service_level": "INST",
            "local_instrument": "RFP"
        },
        "rfp_specific": {
            "expiry_days": 7,
            "allow_partial_payment": false,
            "allow_modification": true,
            "reminder_enabled": true
        },
        "required_fields": [
            "creditor_name", "creditor_account", "creditor_agent_bic",
            "debtor_name", "debtor_account", "debtor_agent_bic",
            "amount", "currency", "payment_due_date"
        ],
        "response_message_type": "pain.014.001.07"
    }',
    '{
        "amount": {
            "min": 0.01,
            "max": 500000,
            "decimal_places": 2
        },
        "currency": {
            "allowed": ["USD"]
        },
        "payment_due_date": {
            "min_days_from_now": 0,
            "max_days_from_now": 30
        }
    }',
    TRUE,
    'SYSTEM'
);

-- Product 3: Payment Return
INSERT INTO payment_products (
    product_id, rail_id, product_code, product_name, product_description,
    product_type, is_instant, requires_response, max_amount, min_amount,
    fee_structure, product_config, validation_rules, is_active, created_by
)
VALUES (
    '44444444-4444-4444-4444-444444444003',
    '33333333-3333-3333-3333-333333333001',
    'FEDNOW_RTN',
    'FedNow Payment Return',
    'Return of a previously completed FedNow payment - camt.056 message',
    'RETURN',
    TRUE,
    TRUE,
    500000.00,
    0.01,
    '{
        "fee_type": "FLAT",
        "base_fee": 0.025,
        "currency": "USD",
        "fee_bearer": "ORIGINATOR"
    }',
    '{
        "message_type": "camt.056.001.08",
        "business_service": "FNRTNSVC",
        "return_specific": {
            "return_window_days": 180,
            "requires_original_reference": true,
            "full_return_only": false
        },
        "return_reason_codes": {
            "AC03": "Invalid Creditor Account Number",
            "AC04": "Closed Account Number",
            "AC06": "Blocked Account",
            "AG01": "Transaction Forbidden",
            "AM04": "Insufficient Funds",
            "BE04": "Missing Creditor Address",
            "CUST": "Customer Request",
            "DUPL": "Duplicate Payment",
            "FRAD": "Fraudulent Origin",
            "TECH": "Technical Problem"
        },
        "required_fields": [
            "original_end_to_end_id", "original_uetr",
            "return_amount", "return_reason_code"
        ]
    }',
    '{
        "original_reference": {
            "required": true,
            "uetr_validation": true
        },
        "return_window": {
            "max_days": 180
        }
    }',
    TRUE,
    'SYSTEM'
);

-- Product 4: Payment Status Request
INSERT INTO payment_products (
    product_id, rail_id, product_code, product_name, product_description,
    product_type, is_instant, requires_response, max_amount, min_amount,
    product_config, is_active, created_by
)
VALUES (
    '44444444-4444-4444-4444-444444444004',
    '33333333-3333-3333-3333-333333333001',
    'FEDNOW_STS',
    'FedNow Payment Status Request',
    'Request status of a FedNow payment - pacs.028 message',
    'STATUS_INQUIRY',
    TRUE,
    TRUE,
    NULL,
    NULL,
    '{
        "message_type": "pacs.028.001.03",
        "business_service": "FNSTSSVC",
        "required_fields": [
            "original_end_to_end_id", "original_uetr"
        ],
        "response_message_type": "pacs.002.001.10"
    }',
    TRUE,
    'SYSTEM'
);

-- ============================================================================
-- SECTION 5: RAIL-COUNTRY AND RAIL-CURRENCY MAPPINGS
-- ============================================================================

-- FedNow is available in USA only
INSERT INTO payment_rail_countries (rail_country_id, rail_id, country_id, is_domestic, is_cross_border, is_active, effective_from, country_specific_config)
VALUES (
    '55555555-5555-5555-5555-555555555001',
    '33333333-3333-3333-3333-333333333001',
    '11111111-1111-1111-1111-111111111001',
    TRUE,
    FALSE,
    TRUE,
    '2023-07-20',
    '{
        "regulatory_body": "Federal Reserve",
        "regulatory_framework": "Regulation J",
        "reporting_requirements": {
            "ctr_threshold": 10000,
            "sar_required": true
        },
        "operating_rules": "FedNow Service Operating Circular"
    }'
);

-- FedNow supports USD only
INSERT INTO payment_rail_currencies (rail_currency_id, rail_id, currency_id, is_primary, is_active, currency_specific_config)
VALUES (
    '66666666-6666-6666-6666-666666666001',
    '33333333-3333-3333-3333-333333333001',
    '22222222-2222-2222-2222-222222222001',
    TRUE,
    TRUE,
    '{
        "decimal_places": 2,
        "rounding_mode": "HALF_EVEN",
        "amount_format": "#,##0.00"
    }'
);

-- ============================================================================
-- SECTION 6: WORKFLOW DEFINITIONS FOR FEDNOW
-- ============================================================================

-- Workflow 1: Outbound Credit Transfer
INSERT INTO workflow_definitions (
    workflow_id, rail_id, product_id, workflow_code, workflow_name,
    workflow_description, workflow_version, direction, is_default, is_active,
    workflow_config, retry_policy, timeout_config, hitl_config, created_by
)
VALUES (
    '77777777-7777-7777-7777-777777777001',
    '33333333-3333-3333-3333-333333333001',
    '44444444-4444-4444-4444-444444444001',
    'FEDNOW_ICT_OUT',
    'FedNow Outbound Credit Transfer Workflow',
    'Complete workflow for sending instant credit transfers through FedNow',
    '1.0',
    'OUTBOUND',
    TRUE,
    TRUE,
    '{
        "parallel_steps_allowed": false,
        "compensating_transaction_enabled": true,
        "audit_level": "DETAILED",
        "notification_events": ["INITIATED", "SENT_TO_RAIL", "COMPLETED", "FAILED"]
    }',
    '{
        "max_retries": 3,
        "retry_delay_seconds": 5,
        "exponential_backoff": true,
        "backoff_multiplier": 2,
        "max_retry_delay_seconds": 60,
        "retryable_errors": ["TIMEOUT", "CONNECTION_ERROR", "TEMPORARY_FAILURE"]
    }',
    '{
        "workflow_timeout_minutes": 5,
        "step_timeout_minutes": 1,
        "acknowledgment_timeout_seconds": 20
    }',
    '{
        "enabled": true,
        "auto_escalate_after_minutes": 15,
        "require_approval_for": ["SUSPICIOUS", "ERROR", "AMOUNT_THRESHOLD"],
        "amount_threshold": 100000,
        "queues": {
            "default": "FEDNOW_OPERATIONS",
            "compliance": "FEDNOW_COMPLIANCE",
            "fraud": "FEDNOW_FRAUD"
        }
    }',
    'SYSTEM'
);

-- Workflow 2: Inbound Credit Transfer
INSERT INTO workflow_definitions (
    workflow_id, rail_id, product_id, workflow_code, workflow_name,
    workflow_description, workflow_version, direction, is_default, is_active,
    workflow_config, retry_policy, timeout_config, hitl_config, created_by
)
VALUES (
    '77777777-7777-7777-7777-777777777002',
    '33333333-3333-3333-3333-333333333001',
    '44444444-4444-4444-4444-444444444001',
    'FEDNOW_ICT_IN',
    'FedNow Inbound Credit Transfer Workflow',
    'Complete workflow for receiving instant credit transfers through FedNow',
    '1.0',
    'INBOUND',
    TRUE,
    TRUE,
    '{
        "auto_credit_enabled": true,
        "hold_for_review_threshold": 50000,
        "positive_response_required": true,
        "positive_response_timeout_seconds": 20
    }',
    '{
        "max_retries": 2,
        "retry_delay_seconds": 3,
        "exponential_backoff": false
    }',
    '{
        "workflow_timeout_minutes": 1,
        "step_timeout_minutes": 0.5
    }',
    '{
        "enabled": true,
        "auto_escalate_after_minutes": 5,
        "require_approval_for": ["SUSPICIOUS", "FRAUD_ALERT"],
        "queues": {
            "default": "FEDNOW_INBOUND",
            "fraud": "FEDNOW_FRAUD"
        }
    }',
    'SYSTEM'
);

-- ============================================================================
-- SECTION 7: WORKFLOW STEPS
-- ============================================================================

-- Steps for Outbound Credit Transfer Workflow
INSERT INTO workflow_steps (step_id, workflow_id, step_sequence, step_code, step_name, step_description, step_type, is_mandatory, is_async, is_hitl_checkpoint, on_error_action, max_retries, step_config, hitl_triggers, is_active)
VALUES
-- Step 1: Initial Validation
('88888888-8888-8888-8888-888888888001', '77777777-7777-7777-7777-777777777001', 1, 'INIT_VALIDATION', 'Initial Request Validation', 'Validate incoming payment request format and required fields', 'VALIDATION', TRUE, FALSE, FALSE, 'FAIL', 0,
 '{"validation_type": "SCHEMA", "schema_ref": "fednow_pacs008_request", "fail_fast": true}',
 '[]', TRUE),

-- Step 2: Business Rules Validation
('88888888-8888-8888-8888-888888888002', '77777777-7777-7777-7777-777777777001', 2, 'BUSINESS_VALIDATION', 'Business Rules Validation', 'Apply business rules and limits', 'VALIDATION', TRUE, FALSE, FALSE, 'FAIL', 0,
 '{"check_daily_limits": true, "check_single_txn_limit": true, "check_velocity": true}',
 '[{"condition": "velocity_exceeded", "context": "SUSPICIOUS"}]', TRUE),

-- Step 3: Compliance Check
('88888888-8888-8888-8888-888888888003', '77777777-7777-7777-7777-777777777001', 3, 'COMPLIANCE_CHECK', 'AML/Sanctions Screening', 'Screen parties against sanctions lists and AML rules', 'COMPLIANCE_CHECK', TRUE, FALSE, TRUE, 'HITL', 0,
 '{"screening_provider": "INTERNAL", "lists": ["OFAC_SDN", "OFAC_SSI", "UN_CONSOLIDATED"], "fuzzy_match_threshold": 85}',
 '[{"condition": "sanctions_match", "context": "COMPLIANCE_REVIEW"}, {"condition": "pep_match", "context": "COMPLIANCE_REVIEW"}]', TRUE),

-- Step 4: Fraud Check
('88888888-8888-8888-8888-888888888004', '77777777-7777-7777-7777-777777777001', 4, 'FRAUD_CHECK', 'Fraud Detection', 'Run fraud detection algorithms', 'FRAUD_CHECK', TRUE, FALSE, TRUE, 'HITL', 0,
 '{"fraud_provider": "INTERNAL", "risk_threshold": 0.7, "ml_model_version": "v2.1"}',
 '[{"condition": "high_risk_score", "context": "FRAUD_ALERT"}, {"condition": "unusual_pattern", "context": "SUSPICIOUS"}]', TRUE),

-- Step 5: Balance Check
('88888888-8888-8888-8888-888888888005', '77777777-7777-7777-7777-777777777001', 5, 'BALANCE_CHECK', 'Liquidity/Balance Check', 'Verify sufficient funds for the transaction', 'AUTHORIZATION', TRUE, FALSE, FALSE, 'FAIL', 2,
 '{"check_type": "REAL_TIME", "include_pending": true, "reserve_funds": true}',
 '[]', TRUE),

-- Step 6: Message Transformation
('88888888-8888-8888-8888-888888888006', '77777777-7777-7777-7777-777777777001', 6, 'MSG_TRANSFORM', 'ISO 20022 Message Generation', 'Transform to FedNow pacs.008 message format', 'TRANSFORMATION', TRUE, FALSE, FALSE, 'FAIL', 1,
 '{"target_format": "pacs.008.001.08", "include_uetr": true, "sign_message": true}',
 '[]', TRUE),

-- Step 7: Amount Threshold HITL (Conditional)
('88888888-8888-8888-8888-888888888007', '77777777-7777-7777-7777-777777777001', 7, 'AMOUNT_REVIEW', 'High Value Transaction Review', 'Manual review for high-value transactions', 'HITL_CHECKPOINT', FALSE, FALSE, TRUE, 'HITL', 0,
 '{"threshold": 100000, "auto_approve_below": true}',
 '[{"condition": "amount_above_threshold", "context": "AMOUNT_THRESHOLD"}]', TRUE),

-- Step 8: Submit to FedNow
('88888888-8888-8888-8888-888888888008', '77777777-7777-7777-7777-777777777001', 8, 'SUBMIT_RAIL', 'Submit to FedNow', 'Send the payment message to FedNow Service', 'SUBMISSION', TRUE, FALSE, FALSE, 'RETRY', 3,
 '{"endpoint": "send_payment", "await_ack": true, "ack_timeout_seconds": 20}',
 '[{"condition": "timeout", "context": "ERROR"}]', TRUE),

-- Step 9: Process Acknowledgment
('88888888-8888-8888-8888-888888888009', '77777777-7777-7777-7777-777777777001', 9, 'PROCESS_ACK', 'Process FedNow Acknowledgment', 'Handle the acknowledgment from FedNow', 'ACKNOWLEDGMENT', TRUE, FALSE, FALSE, 'HITL', 2,
 '{"expected_ack": "pacs.002", "timeout_seconds": 20}',
 '[{"condition": "negative_ack", "context": "ERROR"}, {"condition": "missing_ack", "context": "ERROR"}]', TRUE),

-- Step 10: Update Settlement
('88888888-8888-8888-8888-888888888010', '77777777-7777-7777-7777-777777777001', 10, 'SETTLEMENT', 'Update Settlement Status', 'Update internal records with settlement confirmation', 'SETTLEMENT', TRUE, FALSE, FALSE, 'HITL', 1,
 '{"update_balance": true, "release_reserve": false, "post_accounting": true}',
 '[]', TRUE),

-- Step 11: Send Notification
('88888888-8888-8888-8888-888888888011', '77777777-7777-7777-7777-777777777001', 11, 'NOTIFICATION', 'Send Completion Notification', 'Notify relevant parties of transaction completion', 'NOTIFICATION', FALSE, TRUE, FALSE, 'SKIP', 2,
 '{"channels": ["EMAIL", "WEBHOOK", "SMS"], "template": "fednow_payment_complete"}',
 '[]', TRUE);

-- Steps for Inbound Credit Transfer Workflow
INSERT INTO workflow_steps (step_id, workflow_id, step_sequence, step_code, step_name, step_description, step_type, is_mandatory, is_async, is_hitl_checkpoint, on_error_action, max_retries, step_config, hitl_triggers, is_active)
VALUES
-- Step 1: Message Reception
('99999999-9999-9999-9999-999999999001', '77777777-7777-7777-7777-777777777002', 1, 'MSG_RECEIVE', 'Receive FedNow Message', 'Receive and parse incoming FedNow message', 'VALIDATION', TRUE, FALSE, FALSE, 'FAIL', 0,
 '{"validate_signature": true, "validate_schema": true, "duplicate_check": true}',
 '[]', TRUE),

-- Step 2: Account Validation
('99999999-9999-9999-9999-999999999002', '77777777-7777-7777-7777-777777777002', 2, 'ACCT_VALIDATION', 'Creditor Account Validation', 'Validate creditor account exists and can receive funds', 'VALIDATION', TRUE, FALSE, FALSE, 'FAIL', 0,
 '{"check_account_status": true, "check_account_type": true, "check_currency": true}',
 '[]', TRUE),

-- Step 3: Fraud Screening
('99999999-9999-9999-9999-999999999003', '77777777-7777-7777-7777-777777777002', 3, 'INBOUND_FRAUD', 'Inbound Fraud Check', 'Screen inbound payment for fraud indicators', 'FRAUD_CHECK', TRUE, FALSE, TRUE, 'HITL', 0,
 '{"real_time_scoring": true, "risk_threshold": 0.8}',
 '[{"condition": "fraud_suspected", "context": "FRAUD_ALERT"}]', TRUE),

-- Step 4: Send Positive Acknowledgment
('99999999-9999-9999-9999-999999999004', '77777777-7777-7777-7777-777777777002', 4, 'SEND_ACK', 'Send Positive Response', 'Send positive acknowledgment to FedNow within 20 seconds', 'SUBMISSION', TRUE, FALSE, FALSE, 'FAIL', 1,
 '{"response_type": "POSITIVE", "message_type": "pacs.002", "max_response_time_seconds": 20}',
 '[]', TRUE),

-- Step 5: Credit Account
('99999999-9999-9999-9999-999999999005', '77777777-7777-7777-7777-777777777002', 5, 'CREDIT_ACCT', 'Credit Beneficiary Account', 'Credit the funds to the beneficiary account', 'SETTLEMENT', TRUE, FALSE, FALSE, 'HITL', 2,
 '{"immediate_availability": true, "post_accounting": true}',
 '[]', TRUE),

-- Step 6: Notification
('99999999-9999-9999-9999-999999999006', '77777777-7777-7777-7777-777777777002', 6, 'NOTIFY_CREDIT', 'Notify Beneficiary', 'Send notification to beneficiary of received funds', 'NOTIFICATION', FALSE, TRUE, FALSE, 'SKIP', 2,
 '{"channels": ["PUSH", "EMAIL"], "template": "fednow_credit_received"}',
 '[]', TRUE);

-- ============================================================================
-- SECTION 8: WORKFLOW STEP TRANSITIONS
-- ============================================================================

-- Transitions for Outbound Workflow
INSERT INTO workflow_step_transitions (transition_id, workflow_id, from_step_id, to_step_id, transition_trigger, priority, is_active)
VALUES
-- Start to Step 1
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', '77777777-7777-7777-7777-777777777001', NULL, '88888888-8888-8888-8888-888888888001', 'PENDING', 1, TRUE),
-- Step 1 to Step 2 (on success)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888001', '88888888-8888-8888-8888-888888888002', 'SUCCESS', 1, TRUE),
-- Step 2 to Step 3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888002', '88888888-8888-8888-8888-888888888003', 'SUCCESS', 1, TRUE),
-- Step 3 to Step 4
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888003', '88888888-8888-8888-8888-888888888004', 'SUCCESS', 1, TRUE),
-- Step 3 to Step 4 after HITL approval
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888003', '88888888-8888-8888-8888-888888888004', 'HITL_APPROVED', 1, TRUE),
-- Step 4 to Step 5
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888004', '88888888-8888-8888-8888-888888888005', 'SUCCESS', 1, TRUE),
-- Step 5 to Step 6
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa007', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888005', '88888888-8888-8888-8888-888888888006', 'SUCCESS', 1, TRUE),
-- Step 6 to Step 7
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa008', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888006', '88888888-8888-8888-8888-888888888007', 'SUCCESS', 1, TRUE),
-- Step 7 to Step 8
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa009', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888007', '88888888-8888-8888-8888-888888888008', 'SUCCESS', 1, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa010', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888007', '88888888-8888-8888-8888-888888888008', 'HITL_APPROVED', 1, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa011', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888007', '88888888-8888-8888-8888-888888888008', 'SKIPPED', 1, TRUE),
-- Step 8 to Step 9
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa012', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888008', '88888888-8888-8888-8888-888888888009', 'SUCCESS', 1, TRUE),
-- Step 9 to Step 10
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa013', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888009', '88888888-8888-8888-8888-888888888010', 'SUCCESS', 1, TRUE),
-- Step 10 to Step 11
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa014', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888010', '88888888-8888-8888-8888-888888888011', 'SUCCESS', 1, TRUE),
-- Step 11 to End
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa015', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888011', NULL, 'SUCCESS', 1, TRUE);

-- ============================================================================
-- SECTION 9: VALIDATION RULES
-- ============================================================================

INSERT INTO validation_rules (rule_id, rail_id, product_id, rule_code, rule_name, rule_description, rule_category, rule_priority, rule_expression, error_code, error_message, is_blocking, is_active, effective_from, created_by)
VALUES
-- Amount validation
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001', 
 'FEDNOW_AMOUNT_LIMIT', 'FedNow Amount Limit', 'Validate transaction amount is within FedNow limits', 'LIMIT', 10,
 '{"field": "instructed_amount", "operator": "BETWEEN", "min": 0.01, "max": 500000}',
 'AM09', 'Amount exceeds FedNow maximum limit of $500,000', TRUE, TRUE, '2023-07-20', 'SYSTEM'),

-- Currency validation
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001',
 'FEDNOW_CURRENCY', 'FedNow Currency Check', 'FedNow only supports USD', 'FORMAT', 5,
 '{"field": "currency_code", "operator": "IN", "values": ["USD"]}',
 'AM03', 'FedNow only supports USD currency', TRUE, TRUE, '2023-07-20', 'SYSTEM'),

-- Routing number validation
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001',
 'FEDNOW_ROUTING_NUM', 'ABA Routing Number Format', 'Validate ABA routing number format and checksum', 'FORMAT', 20,
 '{"field": "routing_number", "operator": "REGEX", "pattern": "^[0-9]{9}$", "aba_checksum": true}',
 'RC01', 'Invalid ABA routing number format or checksum', TRUE, TRUE, '2023-07-20', 'SYSTEM'),

-- End-to-End ID format
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001',
 'FEDNOW_E2E_FORMAT', 'End-to-End ID Format', 'Validate EndToEndId format per ISO 20022', 'FORMAT', 15,
 '{"field": "end_to_end_id", "operator": "REGEX", "pattern": "^[A-Za-z0-9\\\\-\\\\/\\\\?:\\\\(\\\\)\\\\.,''\\\\+ ]{1,35}$"}',
 'FF01', 'Invalid EndToEndId format', TRUE, TRUE, '2023-07-20', 'SYSTEM'),

-- Debtor name required
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001',
 'FEDNOW_DEBTOR_NAME', 'Debtor Name Required', 'Debtor name is mandatory for FedNow', 'BUSINESS', 10,
 '{"field": "debtor_name", "operator": "NOT_EMPTY", "max_length": 140}',
 'BE16', 'Debtor name is required and must not exceed 140 characters', TRUE, TRUE, '2023-07-20', 'SYSTEM'),

-- Creditor name required
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001',
 'FEDNOW_CREDITOR_NAME', 'Creditor Name Required', 'Creditor name is mandatory for FedNow', 'BUSINESS', 10,
 '{"field": "creditor_name", "operator": "NOT_EMPTY", "max_length": 140}',
 'BE17', 'Creditor name is required and must not exceed 140 characters', TRUE, TRUE, '2023-07-20', 'SYSTEM'),

-- Duplicate check
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb007', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001',
 'FEDNOW_DUPLICATE', 'Duplicate Transaction Check', 'Check for duplicate transactions within 24 hours', 'BUSINESS', 5,
 '{"check_type": "DUPLICATE", "fields": ["end_to_end_id", "debtor_account", "creditor_account", "amount"], "window_hours": 24}',
 'AM05', 'Duplicate transaction detected', TRUE, TRUE, '2023-07-20', 'SYSTEM'),

-- FedNow participant validation
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb008', '33333333-3333-3333-3333-333333333001', '44444444-4444-4444-4444-444444444001',
 'FEDNOW_PARTICIPANT', 'FedNow Participant Check', 'Verify creditor bank is a FedNow participant', 'BUSINESS', 25,
 '{"check_type": "DIRECTORY_LOOKUP", "field": "creditor_agent_routing", "directory": "FEDNOW_PARTICIPANTS"}',
 'RC04', 'Creditor bank is not a FedNow participant', TRUE, TRUE, '2023-07-20', 'SYSTEM');

-- ============================================================================
-- SECTION 10: ROUTING RULES
-- ============================================================================

INSERT INTO routing_rules (routing_rule_id, rule_code, rule_name, rule_description, rule_priority, condition_country_from, condition_country_to, condition_currency, condition_amount_min, condition_amount_max, condition_expression, target_rail_id, target_product_id, fallback_rail_id, is_active, effective_from, created_by)
VALUES
-- Primary FedNow routing for US domestic
('cccccccc-cccc-cccc-cccc-ccccccccc001', 
 'US_DOMESTIC_INSTANT', 
 'US Domestic Instant Payment',
 'Route US domestic instant payments under $500K to FedNow',
 10,
 '11111111-1111-1111-1111-111111111001',  -- USA
 '11111111-1111-1111-1111-111111111001',  -- USA
 '22222222-2222-2222-2222-222222222001',  -- USD
 0.01,
 500000.00,
 '{"payment_type": "INSTANT", "is_recurring": false}',
 '33333333-3333-3333-3333-333333333001',  -- FedNow
 '44444444-4444-4444-4444-444444444001',  -- FedNow ICT
 NULL,  -- No fallback specified
 TRUE,
 '2023-07-20',
 'SYSTEM'),

-- Request for Payment routing
('cccccccc-cccc-cccc-cccc-ccccccccc002',
 'US_RFP_FEDNOW',
 'US Request for Payment via FedNow',
 'Route US domestic RfP requests to FedNow',
 20,
 '11111111-1111-1111-1111-111111111001',
 '11111111-1111-1111-1111-111111111001',
 '22222222-2222-2222-2222-222222222001',
 0.01,
 500000.00,
 '{"payment_type": "RFP", "request_for_payment": true}',
 '33333333-3333-3333-3333-333333333001',
 '44444444-4444-4444-4444-444444444002',  -- FedNow RfP
 NULL,
 TRUE,
 '2023-07-20',
 'SYSTEM');

-- ============================================================================
-- SECTION 11: SAMPLE TRANSACTIONS
-- ============================================================================

-- Transaction 1: Successful completed transaction
INSERT INTO payment_transactions (
    transaction_id, transaction_ref, end_to_end_id, instruction_id, uetr,
    rail_id, product_id, workflow_id, direction, status, previous_status,
    instructed_amount, instructed_currency_id, settlement_amount, settlement_currency_id,
    creation_datetime, value_date, settlement_date, completed_datetime,
    purpose_code, remittance_info, current_step_id,
    rail_specific_data, original_message, created_by
)
VALUES (
    'dddddddd-dddd-dddd-dddd-ddddddddd001',
    'FEDNOW-20241215-0000000001',
    'E2E-INV-2024-001234',
    'INSTR-2024-001234',
    'eb6305c9-1f7a-4c3f-8e5d-4b7a9c123456',
    '33333333-3333-3333-3333-333333333001',
    '44444444-4444-4444-4444-444444444001',
    '77777777-7777-7777-7777-777777777001',
    'OUTBOUND',
    'COMPLETED',
    'SETTLED',
    25000.00,
    '22222222-2222-2222-2222-222222222001',
    25000.00,
    '22222222-2222-2222-2222-222222222001',
    '2024-12-15 10:30:00-05',
    '2024-12-15',
    '2024-12-15',
    '2024-12-15 10:30:03-05',
    'SALA',
    'December 2024 Salary Payment - Employee ID: EMP001234',
    '88888888-8888-8888-8888-888888888011',
    '{
        "fednow_message_id": "FN20241215103000001234",
        "business_service": "FNCTSVC",
        "instruction_priority": "HIGH",
        "local_instrument": "INST",
        "service_level": "INST",
        "clearing_system": "USABA",
        "acknowledgment_received": true,
        "acknowledgment_time": "2024-12-15T10:30:02.456Z",
        "settlement_confirmation": "ACCP"
    }',
    '{"raw_pacs008": "...ISO20022 message content..."}',
    'API_CLIENT'
);

-- Transaction 2: Pending approval (high value)
INSERT INTO payment_transactions (
    transaction_id, transaction_ref, end_to_end_id, instruction_id, uetr,
    rail_id, product_id, workflow_id, direction, status,
    instructed_amount, instructed_currency_id,
    creation_datetime, value_date,
    purpose_code, remittance_info, current_step_id, requires_hitl,
    rail_specific_data, created_by
)
VALUES (
    'dddddddd-dddd-dddd-dddd-ddddddddd002',
    'FEDNOW-20241215-0000000002',
    'E2E-VENDOR-2024-005678',
    'INSTR-2024-005678',
    'cd8912ab-2e8b-5d4e-9f6a-5c8b0d234567',
    '33333333-3333-3333-3333-333333333001',
    '44444444-4444-4444-4444-444444444001',
    '77777777-7777-7777-7777-777777777001',
    'OUTBOUND',
    'PENDING_APPROVAL',
    150000.00,
    '22222222-2222-2222-2222-222222222001',
    '2024-12-15 11:45:00-05',
    '2024-12-15',
    'SUPP',
    'Vendor Payment - PO#2024-VND-9876 - Equipment Purchase',
    '88888888-8888-8888-8888-888888888007',
    TRUE,
    '{
        "fednow_message_id": null,
        "pending_reason": "AMOUNT_THRESHOLD",
        "threshold_exceeded": 100000,
        "required_approvals": 2,
        "current_approvals": 0
    }',
    'INTERNAL_USER'
);

-- Transaction 3: Failed transaction
INSERT INTO payment_transactions (
    transaction_id, transaction_ref, end_to_end_id, instruction_id, uetr,
    rail_id, product_id, workflow_id, direction, status, previous_status,
    instructed_amount, instructed_currency_id,
    creation_datetime, value_date,
    purpose_code, remittance_info, current_step_id, retry_count,
    rail_specific_data, created_by
)
VALUES (
    'dddddddd-dddd-dddd-dddd-ddddddddd003',
    'FEDNOW-20241215-0000000003',
    'E2E-RENT-2024-009012',
    'INSTR-2024-009012',
    'ab1234cd-3f9c-6e5f-0a7b-6d9c1e345678',
    '33333333-3333-3333-3333-333333333001',
    '44444444-4444-4444-4444-444444444001',
    '77777777-7777-7777-7777-777777777001',
    'OUTBOUND',
    'FAILED',
    'SENT_TO_RAIL',
    5000.00,
    '22222222-2222-2222-2222-222222222001',
    '2024-12-15 09:15:00-05',
    '2024-12-15',
    'RENT',
    'Monthly Rent Payment - Unit 4B - December 2024',
    '88888888-8888-8888-8888-888888888009',
    2,
    '{
        "fednow_message_id": "FN20241215091500003456",
        "failure_reason": "AC04",
        "failure_description": "Closed Account Number",
        "negative_ack_received": true,
        "negative_ack_time": "2024-12-15T09:15:18.789Z"
    }',
    'API_CLIENT'
);

-- Transaction 4: Suspicious transaction under review
INSERT INTO payment_transactions (
    transaction_id, transaction_ref, end_to_end_id, instruction_id, uetr,
    rail_id, product_id, workflow_id, direction, status,
    instructed_amount, instructed_currency_id,
    creation_datetime, value_date,
    purpose_code, remittance_info, current_step_id, is_suspicious, requires_hitl,
    rail_specific_data, created_by
)
VALUES (
    'dddddddd-dddd-dddd-dddd-ddddddddd004',
    'FEDNOW-20241215-0000000004',
    'E2E-GIFT-2024-003456',
    'INSTR-2024-003456',
    'ef5678gh-4a0d-7f6g-1b8c-7e0d2f456789',
    '33333333-3333-3333-3333-333333333001',
    '44444444-4444-4444-4444-444444444001',
    '77777777-7777-7777-7777-777777777001',
    'OUTBOUND',
    'PENDING_REVIEW',
    9500.00,
    '22222222-2222-2222-2222-222222222001',
    '2024-12-15 14:22:00-05',
    '2024-12-15',
    'CASH',
    'Gift Transfer',
    '88888888-8888-8888-8888-888888888004',
    TRUE,
    TRUE,
    '{
        "fraud_score": 0.78,
        "fraud_indicators": ["unusual_amount_pattern", "new_beneficiary", "round_amount"],
        "velocity_check": {
            "daily_count": 5,
            "daily_amount": 35000
        }
    }',
    'MOBILE_APP'
);

-- Transaction 5: Inbound received transaction
INSERT INTO payment_transactions (
    transaction_id, transaction_ref, end_to_end_id, instruction_id, uetr,
    rail_id, product_id, workflow_id, direction, status, previous_status,
    instructed_amount, instructed_currency_id, settlement_amount, settlement_currency_id,
    creation_datetime, value_date, settlement_date, completed_datetime,
    purpose_code, remittance_info, current_step_id,
    rail_specific_data, created_by
)
VALUES (
    'dddddddd-dddd-dddd-dddd-ddddddddd005',
    'FEDNOW-20241215-0000000005',
    'E2E-EXT-REFUND-8765',
    'INSTR-EXT-8765',
    'gh9012ij-5b1e-8g7h-2c9d-8f1e3g567890',
    '33333333-3333-3333-3333-333333333001',
    '44444444-4444-4444-4444-444444444001',
    '77777777-7777-7777-7777-777777777002',
    'INBOUND',
    'COMPLETED',
    'SETTLED',
    1250.00,
    '22222222-2222-2222-2222-222222222001',
    1250.00,
    '22222222-2222-2222-2222-222222222001',
    '2024-12-15 13:05:00-05',
    '2024-12-15',
    '2024-12-15',
    '2024-12-15 13:05:02-05',
    'OTHR',
    'Refund for Order #ORD-2024-87654',
    '99999999-9999-9999-9999-999999999006',
    '{
        "fednow_message_id": "FN20241215130500008765",
        "originating_bank_routing": "021000089",
        "originating_bank_name": "Citibank NA",
        "positive_ack_sent": true,
        "positive_ack_time": "2024-12-15T13:05:01.234Z",
        "funds_available_immediately": true
    }',
    'FEDNOW_INBOUND'
);

-- ============================================================================
-- SECTION 12: TRANSACTION PARTIES
-- ============================================================================

-- Parties for Transaction 1 (Completed Salary Payment)
INSERT INTO transaction_parties (party_id, transaction_id, party_type, party_name, party_account_number, party_account_type, party_routing_number, address_line1, city, state_province, postal_code, country_id, agent_name, agent_routing_number, party_details)
VALUES
-- Debtor (Sender)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeee001', 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'DEBTOR',
 'Acme Corporation Inc', '1234567890', 'CHECKING', '021000021',
 '100 Corporate Plaza', 'New York', 'NY', '10001',
 '11111111-1111-1111-1111-111111111001',
 'JPMorgan Chase Bank NA', '021000021',
 '{"company_id": "ACME001", "tax_id_last4": "1234", "account_opened": "2015-03-15"}'),
-- Creditor (Receiver)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeee002', 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'CREDITOR',
 'John Smith', '9876543210', 'CHECKING', '026009593',
 '456 Main Street Apt 2B', 'Brooklyn', 'NY', '11201',
 '11111111-1111-1111-1111-111111111001',
 'Bank of America NA', '026009593',
 '{"employee_id": "EMP001234", "relationship": "EMPLOYEE"}');

-- Parties for Transaction 2 (Pending High Value)
INSERT INTO transaction_parties (party_id, transaction_id, party_type, party_name, party_account_number, party_account_type, party_routing_number, address_line1, city, state_province, postal_code, country_id, agent_name, agent_routing_number, party_details)
VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeee003', 'dddddddd-dddd-dddd-dddd-ddddddddd002', 'DEBTOR',
 'Acme Corporation Inc', '1234567890', 'CHECKING', '021000021',
 '100 Corporate Plaza', 'New York', 'NY', '10001',
 '11111111-1111-1111-1111-111111111001',
 'JPMorgan Chase Bank NA', '021000021',
 '{"company_id": "ACME001"}'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeee004', 'dddddddd-dddd-dddd-dddd-ddddddddd002', 'CREDITOR',
 'Industrial Equipment Suppliers LLC', '5544332211', 'CHECKING', '071000013',
 '789 Industrial Parkway', 'Chicago', 'IL', '60601',
 '11111111-1111-1111-1111-111111111001',
 'BMO Harris Bank NA', '071000013',
 '{"vendor_id": "VND-9876", "contract_number": "CTR-2024-456"}');

-- Parties for Transaction 5 (Inbound)
INSERT INTO transaction_parties (party_id, transaction_id, party_type, party_name, party_account_number, party_account_type, party_routing_number, address_line1, city, state_province, postal_code, country_id, agent_name, agent_routing_number, party_details)
VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeee009', 'dddddddd-dddd-dddd-dddd-ddddddddd005', 'DEBTOR',
 'Online Retail Store Inc', '1122334455', 'CHECKING', '021000089',
 '500 E-Commerce Way', 'San Francisco', 'CA', '94102',
 '11111111-1111-1111-1111-111111111001',
 'Citibank NA', '021000089',
 '{"merchant_id": "MER-87654"}'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeee010', 'dddddddd-dddd-dddd-dddd-ddddddddd005', 'CREDITOR',
 'Jane Doe', '6677889900', 'CHECKING', '021000021',
 '789 Oak Avenue', 'Austin', 'TX', '78701',
 '11111111-1111-1111-1111-111111111001',
 'JPMorgan Chase Bank NA', '021000021',
 '{"customer_id": "CUST-12345"}');

-- ============================================================================
-- SECTION 13: PAYMENT PROCESS LOGS (Event Stream)
-- ============================================================================

-- Process logs for Transaction 1 (Complete journey of successful transaction)
INSERT INTO payment_process_logs (log_id, transaction_id, workflow_id, step_id, event_id, event_sequence, event_type, event_timestamp, execution_status, previous_status, transaction_status, step_code, step_name, duration_ms, execution_context, correlation_id, trace_id, message, details)
VALUES
-- Event 1: Transaction Initiated
('ffffffff-ffff-ffff-ffff-fffffffffff01', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', NULL,
 'EVT-001', 1, 'TRANSACTION_INITIATED', '2024-12-15 10:30:00.000-05', 'SUCCESS', NULL, 'INITIATED',
 NULL, NULL, 5, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Payment transaction initiated', '{"source": "API", "client_ip": "10.0.0.100"}'),

-- Event 2: Initial Validation Started
('ffffffff-ffff-ffff-ffff-fffffffffff02', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888001',
 'EVT-002', 2, 'STEP_STARTED', '2024-12-15 10:30:00.010-05', 'IN_PROGRESS', 'PENDING', 'INITIATED',
 'INIT_VALIDATION', 'Initial Request Validation', NULL, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Starting initial validation', '{}'),

-- Event 3: Initial Validation Completed
('ffffffff-ffff-ffff-ffff-fffffffffff03', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888001',
 'EVT-003', 3, 'STEP_COMPLETED', '2024-12-15 10:30:00.025-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'INIT_VALIDATION', 'Initial Request Validation', 15, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Initial validation passed', '{"validations_passed": 8, "validations_failed": 0}'),

-- Event 4: Business Validation
('ffffffff-ffff-ffff-ffff-fffffffffff04', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888002',
 'EVT-004', 4, 'STEP_STARTED', '2024-12-15 10:30:00.030-05', 'IN_PROGRESS', 'PENDING', 'VALIDATED',
 'BUSINESS_VALIDATION', 'Business Rules Validation', NULL, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Starting business rules validation', '{}'),

('ffffffff-ffff-ffff-ffff-fffffffffff05', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888002',
 'EVT-005', 5, 'STEP_COMPLETED', '2024-12-15 10:30:00.055-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'BUSINESS_VALIDATION', 'Business Rules Validation', 25, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Business rules validation passed', '{"daily_limit_remaining": 475000, "velocity_ok": true}'),

-- Event 6: Compliance Check
('ffffffff-ffff-ffff-ffff-fffffffffff06', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888003',
 'EVT-006', 6, 'STEP_STARTED', '2024-12-15 10:30:00.060-05', 'IN_PROGRESS', 'PENDING', 'VALIDATED',
 'COMPLIANCE_CHECK', 'AML/Sanctions Screening', NULL, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Starting compliance screening', '{}'),

('ffffffff-ffff-ffff-ffff-fffffffffff07', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888003',
 'EVT-007', 7, 'STEP_COMPLETED', '2024-12-15 10:30:00.150-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'COMPLIANCE_CHECK', 'AML/Sanctions Screening', 90, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Compliance screening passed', '{"sanctions_clear": true, "pep_clear": true, "risk_score": 0.15}'),

-- Event 8: Fraud Check
('ffffffff-ffff-ffff-ffff-fffffffffff08', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888004',
 'EVT-008', 8, 'STEP_COMPLETED', '2024-12-15 10:30:00.200-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'FRAUD_CHECK', 'Fraud Detection', 45, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Fraud check passed', '{"fraud_score": 0.12, "model_version": "v2.1"}'),

-- Event 9: Balance Check
('ffffffff-ffff-ffff-ffff-fffffffffff09', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888005',
 'EVT-009', 9, 'STEP_COMPLETED', '2024-12-15 10:30:00.220-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'BALANCE_CHECK', 'Liquidity/Balance Check', 18, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Sufficient funds confirmed', '{"available_balance": 150000, "amount_reserved": 25000}'),

-- Event 10: Message Transformation
('ffffffff-ffff-ffff-ffff-fffffffffff10', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888006',
 'EVT-010', 10, 'STEP_COMPLETED', '2024-12-15 10:30:00.280-05', 'SUCCESS', 'IN_PROGRESS', 'PROCESSING',
 'MSG_TRANSFORM', 'ISO 20022 Message Generation', 55, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'pacs.008 message generated', '{"message_size_bytes": 2456, "signed": true}'),

-- Event 11: Amount Review Skipped (below threshold)
('ffffffff-ffff-ffff-ffff-fffffffffff11', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888007',
 'EVT-011', 11, 'STEP_COMPLETED', '2024-12-15 10:30:00.285-05', 'SKIPPED', 'PENDING', 'PROCESSING',
 'AMOUNT_REVIEW', 'High Value Transaction Review', 2, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Amount review skipped - below threshold', '{"threshold": 100000, "amount": 25000}'),

-- Event 12: Submit to FedNow
('ffffffff-ffff-ffff-ffff-fffffffffff12', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888008',
 'EVT-012', 12, 'STEP_STARTED', '2024-12-15 10:30:00.290-05', 'IN_PROGRESS', 'PENDING', 'PROCESSING',
 'SUBMIT_RAIL', 'Submit to FedNow', NULL, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Submitting to FedNow Service', '{}'),

('ffffffff-ffff-ffff-ffff-fffffffffff13', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888008',
 'EVT-013', 13, 'STEP_COMPLETED', '2024-12-15 10:30:02.150-05', 'SUCCESS', 'IN_PROGRESS', 'SENT_TO_RAIL',
 'SUBMIT_RAIL', 'Submit to FedNow', 1860, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Successfully submitted to FedNow', '{"fednow_message_id": "FN20241215103000001234", "http_status": 200}'),

-- Event 14: Process Acknowledgment
('ffffffff-ffff-ffff-ffff-fffffffffff14', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888009',
 'EVT-014', 14, 'STEP_COMPLETED', '2024-12-15 10:30:02.500-05', 'SUCCESS', 'IN_PROGRESS', 'ACKNOWLEDGED',
 'PROCESS_ACK', 'Process FedNow Acknowledgment', 340, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Positive acknowledgment received from FedNow', '{"ack_status": "ACCP", "ack_reason": null}'),

-- Event 15: Settlement Update
('ffffffff-ffff-ffff-ffff-fffffffffff15', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888010',
 'EVT-015', 15, 'STEP_COMPLETED', '2024-12-15 10:30:02.700-05', 'SUCCESS', 'IN_PROGRESS', 'SETTLED',
 'SETTLEMENT', 'Update Settlement Status', 195, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Settlement confirmed and recorded', '{"settlement_id": "STL-2024-001234", "posted": true}'),

-- Event 16: Notification Sent
('ffffffff-ffff-ffff-ffff-fffffffffff16', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888011',
 'EVT-016', 16, 'STEP_COMPLETED', '2024-12-15 10:30:03.000-05', 'SUCCESS', 'IN_PROGRESS', 'COMPLETED',
 'NOTIFICATION', 'Send Completion Notification', 290, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Completion notifications sent', '{"email_sent": true, "webhook_sent": true}'),

-- Event 17: Transaction Completed
('ffffffff-ffff-ffff-ffff-fffffffffff17', 'dddddddd-dddd-dddd-dddd-ddddddddd001', '77777777-7777-7777-7777-777777777001', NULL,
 'EVT-017', 17, 'TRANSACTION_COMPLETED', '2024-12-15 10:30:03.010-05', 'SUCCESS', NULL, 'COMPLETED',
 NULL, NULL, 3010, NULL, 'CORR-2024-001234', 'TRC-2024-001234',
 'Transaction completed successfully', '{"total_processing_time_ms": 3010, "outcome": "SUCCESS"}');

-- Process logs for Transaction 4 (Suspicious - HITL triggered)
INSERT INTO payment_process_logs (log_id, transaction_id, workflow_id, step_id, event_id, event_sequence, event_type, event_timestamp, execution_status, previous_status, transaction_status, step_code, step_name, duration_ms, execution_context, is_hitl_triggered, hitl_reason, correlation_id, trace_id, message, details)
VALUES
('ffffffff-ffff-ffff-ffff-fffffffffff30', 'dddddddd-dddd-dddd-dddd-ddddddddd004', '77777777-7777-7777-7777-777777777001', NULL,
 'EVT-030', 1, 'TRANSACTION_INITIATED', '2024-12-15 14:22:00.000-05', 'SUCCESS', NULL, 'INITIATED',
 NULL, NULL, 3, NULL, FALSE, NULL, 'CORR-2024-003456', 'TRC-2024-003456',
 'Payment transaction initiated', '{"source": "MOBILE_APP"}'),

('ffffffff-ffff-ffff-ffff-fffffffffff31', 'dddddddd-dddd-dddd-dddd-ddddddddd004', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888001',
 'EVT-031', 2, 'STEP_COMPLETED', '2024-12-15 14:22:00.020-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'INIT_VALIDATION', 'Initial Request Validation', 18, NULL, FALSE, NULL, 'CORR-2024-003456', 'TRC-2024-003456',
 'Initial validation passed', '{}'),

('ffffffff-ffff-ffff-ffff-fffffffffff32', 'dddddddd-dddd-dddd-dddd-ddddddddd004', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888002',
 'EVT-032', 3, 'STEP_COMPLETED', '2024-12-15 14:22:00.045-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'BUSINESS_VALIDATION', 'Business Rules Validation', 22, NULL, FALSE, NULL, 'CORR-2024-003456', 'TRC-2024-003456',
 'Business rules passed', '{}'),

('ffffffff-ffff-ffff-ffff-fffffffffff33', 'dddddddd-dddd-dddd-dddd-ddddddddd004', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888003',
 'EVT-033', 4, 'STEP_COMPLETED', '2024-12-15 14:22:00.150-05', 'SUCCESS', 'IN_PROGRESS', 'VALIDATED',
 'COMPLIANCE_CHECK', 'AML/Sanctions Screening', 100, NULL, FALSE, NULL, 'CORR-2024-003456', 'TRC-2024-003456',
 'Compliance screening passed', '{}'),

-- FRAUD CHECK - HITL TRIGGERED
('ffffffff-ffff-ffff-ffff-fffffffffff34', 'dddddddd-dddd-dddd-dddd-ddddddddd004', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888004',
 'EVT-034', 5, 'STEP_STARTED', '2024-12-15 14:22:00.155-05', 'IN_PROGRESS', 'PENDING', 'VALIDATED',
 'FRAUD_CHECK', 'Fraud Detection', NULL, NULL, FALSE, NULL, 'CORR-2024-003456', 'TRC-2024-003456',
 'Starting fraud detection', '{}'),

('ffffffff-ffff-ffff-ffff-fffffffffff35', 'dddddddd-dddd-dddd-dddd-ddddddddd004', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888004',
 'EVT-035', 6, 'STEP_COMPLETED', '2024-12-15 14:22:00.220-05', 'WAITING_HITL', 'IN_PROGRESS', 'PENDING_REVIEW',
 'FRAUD_CHECK', 'Fraud Detection', 65, 'SUSPICIOUS', TRUE, 'High fraud risk score detected (0.78). Multiple indicators: unusual amount pattern, new beneficiary, round amount.',
 'CORR-2024-003456', 'TRC-2024-003456',
 'Fraud check flagged - HITL intervention required', '{"fraud_score": 0.78, "threshold": 0.7, "indicators": ["unusual_amount_pattern", "new_beneficiary", "round_amount"]}'),

('ffffffff-ffff-ffff-ffff-fffffffffff36', 'dddddddd-dddd-dddd-dddd-ddddddddd004', '77777777-7777-7777-7777-777777777001', '88888888-8888-8888-8888-888888888004',
 'EVT-036', 7, 'HITL_CREATED', '2024-12-15 14:22:00.225-05', 'WAITING_HITL', NULL, 'PENDING_REVIEW',
 'FRAUD_CHECK', 'Fraud Detection', 5, 'SUSPICIOUS', TRUE, 'HITL intervention created and queued',
 'CORR-2024-003456', 'TRC-2024-003456',
 'HITL intervention created', '{"intervention_id": "11111111-1111-1111-1111-111111111101", "queue": "FEDNOW_FRAUD", "priority": 2}');

-- ============================================================================
-- SECTION 14: PAYMENT ERROR LOGS
-- ============================================================================

-- Error log for Transaction 3 (Failed - Account Closed)
INSERT INTO payment_error_logs (error_log_id, transaction_id, process_log_id, workflow_id, step_id, error_id, error_code, error_category, error_severity, error_message, error_description, source_system, source_component, is_resolved, requires_hitl, hitl_context, request_payload, response_payload, error_details)
VALUES
('gggggggg-gggg-gggg-gggg-ggggggggg001',
 'dddddddd-dddd-dddd-dddd-ddddddddd003',
 NULL,
 '77777777-7777-7777-7777-777777777001',
 '88888888-8888-8888-8888-888888888009',
 'ERR-2024-003-001',
 'AC04',
 'BUSINESS',
 'ERROR',
 'Closed Account Number',
 'The creditor account number specified in the payment message refers to an account that has been closed. The payment cannot be completed.',
 'FEDNOW',
 'ACK_PROCESSOR',
 FALSE,
 TRUE,
 'ERROR',
 '{"end_to_end_id": "E2E-RENT-2024-009012", "creditor_account": "5566778899"}',
 '{"status": "RJCT", "reason_code": "AC04", "additional_info": "Account closed on 2024-11-30"}',
 '{
     "fednow_error_code": "AC04",
     "iso_error_code": "AC04",
     "error_source": "CREDITOR_BANK",
     "creditor_bank_routing": "031000053",
     "account_status": "CLOSED",
     "account_closed_date": "2024-11-30",
     "recommended_action": "Contact creditor for updated account information"
 }');

-- Technical error example
INSERT INTO payment_error_logs (error_log_id, transaction_id, process_log_id, workflow_id, step_id, error_id, error_code, error_category, error_severity, error_message, error_description, stack_trace, source_system, source_component, is_resolved, resolved_at, resolved_by, resolution_notes, resolution_action, error_details)
VALUES
('gggggggg-gggg-gggg-gggg-ggggggggg002',
 'dddddddd-dddd-dddd-dddd-ddddddddd003',
 NULL,
 '77777777-7777-7777-7777-777777777001',
 '88888888-8888-8888-8888-888888888008',
 'ERR-2024-003-002',
 'TECH_TIMEOUT',
 'TECHNICAL',
 'WARNING',
 'Connection timeout on first attempt',
 'Initial connection to FedNow Service timed out after 5000ms. Retry initiated.',
 'java.net.SocketTimeoutException: connect timed out\n    at java.net.Socket.connect(Socket.java:565)\n    at com.payment.fednow.FedNowClient.send(FedNowClient.java:142)',
 'PAYMENT_ENGINE',
 'FEDNOW_CONNECTOR',
 TRUE,
 '2024-12-15 09:15:08-05',
 'SYSTEM',
 'Resolved automatically after retry succeeded',
 'RETRY',
 '{
     "timeout_ms": 5000,
     "attempt": 1,
     "max_attempts": 3,
     "retry_delay_ms": 1000,
     "resolved_on_attempt": 2
 }');

-- ============================================================================
-- SECTION 15: HITL INTERVENTIONS
-- ============================================================================

-- HITL for Transaction 2 (High Value Pending Approval)
INSERT INTO hitl_interventions (intervention_id, transaction_id, process_log_id, workflow_id, step_id, queue_name, priority, intervention_context, trigger_reason, transaction_status, step_status, created_at, due_at, is_active, is_resolved, review_data)
VALUES
('11111111-1111-1111-1111-111111111101',
 'dddddddd-dddd-dddd-dddd-ddddddddd002',
 NULL,
 '77777777-7777-7777-7777-777777777001',
 '88888888-8888-8888-8888-888888888007',
 'FEDNOW_OPERATIONS',
 3,
 'AMOUNT_THRESHOLD',
 'Transaction amount $150,000 exceeds approval threshold of $100,000. Requires dual approval.',
 'PENDING_APPROVAL',
 'WAITING_HITL',
 '2024-12-15 11:45:00.500-05',
 '2024-12-15 12:15:00-05',
 TRUE,
 FALSE,
 '{
     "transaction_ref": "FEDNOW-20241215-0000000002",
     "amount": 150000,
     "currency": "USD",
     "debtor_name": "Acme Corporation Inc",
     "creditor_name": "Industrial Equipment Suppliers LLC",
     "purpose": "Vendor Payment - Equipment Purchase",
     "threshold_exceeded": 100000,
     "required_approvals": 2,
     "current_approvals": 0,
     "debtor_account_balance": 500000,
     "vendor_relationship": "EXISTING",
     "previous_payments_to_vendor": 5,
     "total_previous_amount": 425000
 }');

-- HITL for Transaction 4 (Suspicious Fraud Alert)
INSERT INTO hitl_interventions (intervention_id, transaction_id, process_log_id, workflow_id, step_id, queue_name, priority, intervention_context, trigger_reason, transaction_status, step_status, created_at, due_at, escalation_at, is_active, is_resolved, review_data)
VALUES
('11111111-1111-1111-1111-111111111102',
 'dddddddd-dddd-dddd-dddd-ddddddddd004',
 'ffffffff-ffff-ffff-ffff-fffffffffff35',
 '77777777-7777-7777-7777-777777777001',
 '88888888-8888-8888-8888-888888888004',
 'FEDNOW_FRAUD',
 2,
 'SUSPICIOUS',
 'High fraud risk score (0.78) detected. Multiple indicators: unusual amount pattern, new beneficiary, round amount near structuring threshold.',
 'PENDING_REVIEW',
 'WAITING_HITL',
 '2024-12-15 14:22:00.225-05',
 '2024-12-15 14:37:00-05',
 '2024-12-15 14:52:00-05',
 TRUE,
 FALSE,
 '{
     "transaction_ref": "FEDNOW-20241215-0000000004",
     "amount": 9500,
     "currency": "USD",
     "debtor_name": "Mobile User Account",
     "creditor_name": "Unknown Beneficiary",
     "purpose_code": "CASH",
     "remittance_info": "Gift Transfer",
     "fraud_analysis": {
         "fraud_score": 0.78,
         "risk_threshold": 0.7,
         "indicators": [
             {"type": "unusual_amount_pattern", "weight": 0.3, "detail": "Amount close to CTR threshold"},
             {"type": "new_beneficiary", "weight": 0.25, "detail": "First payment to this account"},
             {"type": "round_amount", "weight": 0.15, "detail": "Suspiciously round amount"},
             {"type": "velocity", "weight": 0.08, "detail": "5th transaction today, $35,000 total"}
         ],
         "model_version": "fraud_v2.1",
         "model_confidence": 0.92
     },
     "customer_profile": {
         "account_age_days": 180,
         "typical_transaction_amount": 500,
         "typical_monthly_volume": 2500,
         "previous_fraud_flags": 0
     },
     "recommended_actions": ["verify_with_customer", "check_beneficiary", "hold_pending_verification"]
 }');

-- HITL for Transaction 3 (Error requiring resolution)
INSERT INTO hitl_interventions (intervention_id, transaction_id, process_log_id, error_log_id, workflow_id, step_id, queue_name, priority, intervention_context, trigger_reason, transaction_status, step_status, assigned_to, assigned_at, assigned_by, action_taken, action_notes, resolved_at, resolved_by, created_at, due_at, is_active, is_resolved, review_data, modification_data)
VALUES
('11111111-1111-1111-1111-111111111103',
 'dddddddd-dddd-dddd-dddd-ddddddddd003',
 NULL,
 'gggggggg-gggg-gggg-gggg-ggggggggg001',
 '77777777-7777-7777-7777-777777777001',
 '88888888-8888-8888-8888-888888888009',
 'FEDNOW_OPERATIONS',
 4,
 'ERROR',
 'Payment rejected by FedNow - Creditor account closed (AC04). Customer notification required.',
 'FAILED',
 'FAILURE',
 'john.operator@bank.com',
 '2024-12-15 09:20:00-05',
 'SYSTEM',
 'CANCEL',
 'Contacted customer. They confirmed the creditor closed the account. Customer will initiate new payment with updated account details.',
 '2024-12-15 09:45:00-05',
 'john.operator@bank.com',
 '2024-12-15 09:15:20-05',
 '2024-12-15 09:45:00-05',
 FALSE,
 TRUE,
 '{
     "transaction_ref": "FEDNOW-20241215-0000000003",
     "error_code": "AC04",
     "error_message": "Closed Account Number",
     "original_creditor_account": "5566778899",
     "original_creditor_name": "Property Management LLC",
     "customer_contact_required": true
 }',
 NULL);

-- ============================================================================
-- SECTION 16: HITL AUDIT TRAIL
-- ============================================================================

INSERT INTO hitl_audit_trail (audit_id, intervention_id, transaction_id, action_type, action_by, action_at, previous_state, new_state, action_reason, action_notes, ip_address)
VALUES
-- Assignment action
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhh001',
 '11111111-1111-1111-1111-111111111103',
 'dddddddd-dddd-dddd-dddd-ddddddddd003',
 'APPROVE',
 'SYSTEM',
 '2024-12-15 09:20:00-05',
 '{"assigned_to": null, "status": "PENDING"}',
 '{"assigned_to": "john.operator@bank.com", "status": "ASSIGNED"}',
 'Auto-assignment based on queue rules',
 'Assigned to available operator in FEDNOW_OPERATIONS queue',
 '10.0.0.50'),

-- Cancel action
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhh002',
 '11111111-1111-1111-1111-111111111103',
 'dddddddd-dddd-dddd-dddd-ddddddddd003',
 'CANCEL',
 'john.operator@bank.com',
 '2024-12-15 09:45:00-05',
 '{"status": "ASSIGNED", "transaction_status": "FAILED"}',
 '{"status": "RESOLVED", "action": "CANCELLED", "resolution": "Customer will re-initiate"}',
 'Customer confirmed account closure',
 'Customer contacted via phone. Confirmed the landlord closed the old account. Customer will send new payment with updated details.',
 '10.0.0.55');

-- ============================================================================
-- SECTION 17: SYSTEM CONFIGURATION
-- ============================================================================

INSERT INTO system_configuration (config_id, config_key, config_value, config_type, category, description, is_sensitive, is_active, created_by)
VALUES
-- FedNow specific configurations
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii001', 'fednow.enabled', 'true', 'BOOLEAN', 'RAILS', 'Enable/disable FedNow payment rail', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii002', 'fednow.max_transaction_amount', '500000', 'NUMBER', 'RAILS', 'Maximum transaction amount for FedNow in USD', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii003', 'fednow.ack_timeout_seconds', '20', 'NUMBER', 'RAILS', 'Timeout for FedNow acknowledgment in seconds', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii004', 'fednow.api_endpoint', 'https://fednow.frb.org/api/v1', 'STRING', 'RAILS', 'FedNow API base endpoint', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii005', 'fednow.participant_id', 'FNPART001234', 'STRING', 'RAILS', 'Our FedNow participant identifier', FALSE, TRUE, 'SYSTEM'),

-- HITL configurations
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii010', 'hitl.auto_escalate_minutes', '30', 'NUMBER', 'HITL', 'Minutes before auto-escalation of HITL items', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii011', 'hitl.high_value_threshold', '100000', 'NUMBER', 'HITL', 'Amount threshold for high-value review', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii012', 'hitl.fraud_score_threshold', '0.7', 'NUMBER', 'HITL', 'Fraud score threshold for HITL trigger', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii013', 'hitl.max_queue_size', '1000', 'NUMBER', 'HITL', 'Maximum items in HITL queue before alerts', FALSE, TRUE, 'SYSTEM'),

-- Compliance configurations
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii020', 'compliance.ctr_threshold', '10000', 'NUMBER', 'COMPLIANCE', 'Currency Transaction Report threshold', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii021', 'compliance.sanctions_lists', '["OFAC_SDN", "OFAC_SSI", "UN_CONSOLIDATED"]', 'JSON', 'COMPLIANCE', 'Active sanctions lists for screening', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii022', 'compliance.fuzzy_match_threshold', '85', 'NUMBER', 'COMPLIANCE', 'Fuzzy match percentage for sanctions screening', FALSE, TRUE, 'SYSTEM'),

-- Notification configurations
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii030', 'notification.email_enabled', 'true', 'BOOLEAN', 'NOTIFICATION', 'Enable email notifications', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii031', 'notification.webhook_enabled', 'true', 'BOOLEAN', 'NOTIFICATION', 'Enable webhook notifications', FALSE, TRUE, 'SYSTEM'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiii032', 'notification.sms_enabled', 'true', 'BOOLEAN', 'NOTIFICATION', 'Enable SMS notifications', FALSE, TRUE, 'SYSTEM');

-- ============================================================================
-- SECTION 18: FEE CONFIGURATION
-- ============================================================================

INSERT INTO fee_configuration (fee_id, rail_id, product_id, fee_code, fee_name, fee_type, fee_amount, fee_percentage, min_fee, max_fee, currency_id, amount_from, amount_to, is_active, effective_from, created_by)
VALUES
-- FedNow ICT fees
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjj001',
 '33333333-3333-3333-3333-333333333001',
 '44444444-4444-4444-4444-444444444001',
 'FEDNOW_ICT_FLAT',
 'FedNow Instant Credit Transfer Fee',
 'FLAT',
 0.045,
 NULL,
 0.045,
 0.045,
 '22222222-2222-2222-2222-222222222001',
 0.01,
 500000.00,
 TRUE,
 '2023-07-20',
 'SYSTEM'),

-- FedNow RfP fees
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjj002',
 '33333333-3333-3333-3333-333333333001',
 '44444444-4444-4444-4444-444444444002',
 'FEDNOW_RFP_FLAT',
 'FedNow Request for Payment Fee',
 'FLAT',
 0.035,
 NULL,
 0.035,
 0.035,
 '22222222-2222-2222-2222-222222222001',
 0.01,
 500000.00,
 TRUE,
 '2023-07-20',
 'SYSTEM'),

-- FedNow Return fees
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjj003',
 '33333333-3333-3333-3333-333333333001',
 '44444444-4444-4444-4444-444444444003',
 'FEDNOW_RTN_FLAT',
 'FedNow Payment Return Fee',
 'FLAT',
 0.025,
 NULL,
 0.025,
 0.025,
 '22222222-2222-2222-2222-222222222001',
 0.01,
 500000.00,
 TRUE,
 '2023-07-20',
 'SYSTEM');

-- ============================================================================
-- SECTION 19: VERIFICATION QUERIES
-- ============================================================================

-- Uncomment these to verify data after loading

-- SELECT 'Countries' as entity, COUNT(*) as count FROM countries;
-- SELECT 'Currencies' as entity, COUNT(*) as count FROM currencies;
-- SELECT 'Payment Rails' as entity, COUNT(*) as count FROM payment_rails;
-- SELECT 'Payment Products' as entity, COUNT(*) as count FROM payment_products;
-- SELECT 'Rail Countries' as entity, COUNT(*) as count FROM payment_rail_countries;
-- SELECT 'Rail Currencies' as entity, COUNT(*) as count FROM payment_rail_currencies;
-- SELECT 'Workflow Definitions' as entity, COUNT(*) as count FROM workflow_definitions;
-- SELECT 'Workflow Steps' as entity, COUNT(*) as count FROM workflow_steps;
-- SELECT 'Step Transitions' as entity, COUNT(*) as count FROM workflow_step_transitions;
-- SELECT 'Validation Rules' as entity, COUNT(*) as count FROM validation_rules;
-- SELECT 'Routing Rules' as entity, COUNT(*) as count FROM routing_rules;
-- SELECT 'Transactions' as entity, COUNT(*) as count FROM payment_transactions;
-- SELECT 'Transaction Parties' as entity, COUNT(*) as count FROM transaction_parties;
-- SELECT 'Process Logs' as entity, COUNT(*) as count FROM payment_process_logs;
-- SELECT 'Error Logs' as entity, COUNT(*) as count FROM payment_error_logs;
-- SELECT 'HITL Interventions' as entity, COUNT(*) as count FROM hitl_interventions;
-- SELECT 'HITL Audit Trail' as entity, COUNT(*) as count FROM hitl_audit_trail;
-- SELECT 'System Config' as entity, COUNT(*) as count FROM system_configuration;
-- SELECT 'Fee Config' as entity, COUNT(*) as count FROM fee_configuration;

-- Verify transaction journey view
-- SELECT * FROM vw_transaction_journey WHERE transaction_ref = 'FEDNOW-20241215-0000000001' ORDER BY event_sequence;

-- Verify active HITL queue
-- SELECT * FROM vw_active_hitl_queue;

-- ============================================================================
-- END OF DML SCRIPT
-- ============================================================================

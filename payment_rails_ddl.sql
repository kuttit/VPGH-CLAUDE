-- ============================================================================
-- MULTI-PAYMENT RAIL SAAS PLATFORM - DDL SCRIPT
-- Database: PostgreSQL 15+
-- Author: Payment Platform Team
-- Description: Generic and dynamic schema supporting multiple payment rails
--              with event streaming, workflow management, and HITL support
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SECTION 1: ENUM TYPES FOR STATUS MANAGEMENT
-- ============================================================================

-- Transaction lifecycle statuses
CREATE TYPE transaction_status AS ENUM (
    'INITIATED',
    'VALIDATED',
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'PROCESSING',
    'SENT_TO_RAIL',
    'ACKNOWLEDGED',
    'SETTLED',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'RETURNED',
    'SUSPICIOUS',
    'ON_HOLD',
    'PENDING_REVIEW'
);

-- Process step execution statuses
CREATE TYPE step_execution_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'SUCCESS',
    'FAILURE',
    'ERROR',
    'SUSPICIOUS',
    'SKIPPED',
    'TIMEOUT',
    'WAITING_HITL',
    'HITL_APPROVED',
    'HITL_REJECTED',
    'RETRYING'
);

-- HITL intervention types
CREATE TYPE hitl_action_type AS ENUM (
    'APPROVE',
    'REJECT',
    'RETRY',
    'RESTART',
    'SKIP',
    'ESCALATE',
    'MODIFY',
    'CANCEL',
    'FORCE_COMPLETE'
);

-- HITL intervention context
CREATE TYPE hitl_context AS ENUM (
    'SUCCESS',
    'FAILURE',
    'SUSPICIOUS',
    'ERROR',
    'TIMEOUT',
    'COMPLIANCE_REVIEW',
    'AMOUNT_THRESHOLD',
    'FRAUD_ALERT'
);

-- Payment direction
CREATE TYPE payment_direction AS ENUM (
    'INBOUND',
    'OUTBOUND',
    'INTERNAL'
);

-- Party type in transaction
CREATE TYPE party_type AS ENUM (
    'DEBTOR',
    'CREDITOR',
    'ORIGINATOR',
    'BENEFICIARY',
    'INTERMEDIARY',
    'CORRESPONDENT'
);

-- Error severity levels
CREATE TYPE error_severity AS ENUM (
    'INFO',
    'WARNING',
    'ERROR',
    'CRITICAL',
    'FATAL'
);

-- Workflow step types
CREATE TYPE workflow_step_type AS ENUM (
    'VALIDATION',
    'TRANSFORMATION',
    'ENRICHMENT',
    'ROUTING',
    'COMPLIANCE_CHECK',
    'FRAUD_CHECK',
    'AUTHORIZATION',
    'SUBMISSION',
    'ACKNOWLEDGMENT',
    'SETTLEMENT',
    'NOTIFICATION',
    'RECONCILIATION',
    'HITL_CHECKPOINT'
);

-- ============================================================================
-- SECTION 2: REFERENCE/MASTER TABLES
-- ============================================================================

-- Countries Master
CREATE TABLE countries (
    country_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(3) NOT NULL UNIQUE,           -- ISO 3166-1 alpha-3
    country_code_alpha2 VARCHAR(2) NOT NULL UNIQUE,    -- ISO 3166-1 alpha-2
    country_name VARCHAR(100) NOT NULL,
    numeric_code VARCHAR(3),
    is_active BOOLEAN DEFAULT TRUE,
    region VARCHAR(50),
    sub_region VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_countries_code ON countries(country_code);
CREATE INDEX idx_countries_alpha2 ON countries(country_code_alpha2);

-- Currencies Master
CREATE TABLE currencies (
    currency_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_code VARCHAR(3) NOT NULL UNIQUE,          -- ISO 4217
    currency_name VARCHAR(100) NOT NULL,
    numeric_code VARCHAR(3),
    minor_units SMALLINT DEFAULT 2,
    symbol VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_currencies_code ON currencies(currency_code);

-- ============================================================================
-- SECTION 3: PAYMENT RAIL CONFIGURATION TABLES
-- ============================================================================

-- Payment Rails Master (FedNow, SWIFT, ACH, SEPA, etc.)
CREATE TABLE payment_rails (
    rail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rail_code VARCHAR(50) NOT NULL UNIQUE,
    rail_name VARCHAR(100) NOT NULL,
    rail_description TEXT,
    rail_type VARCHAR(50) NOT NULL,                    -- REAL_TIME, BATCH, WIRE
    operator_name VARCHAR(100),
    operator_country_id UUID REFERENCES countries(country_id),
    is_real_time BOOLEAN DEFAULT FALSE,
    is_24x7 BOOLEAN DEFAULT FALSE,
    settlement_type VARCHAR(50),                       -- INSTANT, DEFERRED, NET
    max_amount DECIMAL(18,2),
    min_amount DECIMAL(18,2) DEFAULT 0,
    cutoff_time TIME,
    timezone VARCHAR(50),
    message_format VARCHAR(50),                        -- ISO20022, MT, PROPRIETARY
    version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    -- Dynamic attributes specific to each rail
    rail_config JSONB DEFAULT '{}',
    api_config JSONB DEFAULT '{}',
    security_config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_payment_rails_code ON payment_rails(rail_code);
CREATE INDEX idx_payment_rails_type ON payment_rails(rail_type);
CREATE INDEX idx_payment_rails_active ON payment_rails(is_active);

-- Payment Products per Rail
CREATE TABLE payment_products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rail_id UUID NOT NULL REFERENCES payment_rails(rail_id),
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    product_type VARCHAR(50),                          -- CREDIT_TRANSFER, REQUEST_FOR_PAYMENT, RETURN
    is_instant BOOLEAN DEFAULT FALSE,
    requires_response BOOLEAN DEFAULT FALSE,
    max_amount DECIMAL(18,2),
    min_amount DECIMAL(18,2) DEFAULT 0,
    fee_structure JSONB DEFAULT '{}',
    -- Dynamic attributes specific to each product
    product_config JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    UNIQUE(rail_id, product_code)
);

CREATE INDEX idx_payment_products_rail ON payment_products(rail_id);
CREATE INDEX idx_payment_products_code ON payment_products(product_code);

-- Rail-Country Mapping (which rails available in which countries)
CREATE TABLE payment_rail_countries (
    rail_country_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rail_id UUID NOT NULL REFERENCES payment_rails(rail_id),
    country_id UUID NOT NULL REFERENCES countries(country_id),
    is_domestic BOOLEAN DEFAULT TRUE,
    is_cross_border BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    country_specific_config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rail_id, country_id)
);

CREATE INDEX idx_rail_countries_rail ON payment_rail_countries(rail_id);
CREATE INDEX idx_rail_countries_country ON payment_rail_countries(country_id);

-- Rail-Currency Mapping (which currencies supported per rail)
CREATE TABLE payment_rail_currencies (
    rail_currency_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rail_id UUID NOT NULL REFERENCES payment_rails(rail_id),
    currency_id UUID NOT NULL REFERENCES currencies(currency_id),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    exchange_rate_source VARCHAR(100),
    currency_specific_config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rail_id, currency_id)
);

CREATE INDEX idx_rail_currencies_rail ON payment_rail_currencies(rail_id);

-- ============================================================================
-- SECTION 4: WORKFLOW DEFINITION TABLES
-- ============================================================================

-- Workflow Definitions (per Rail/Product combination)
CREATE TABLE workflow_definitions (
    workflow_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rail_id UUID NOT NULL REFERENCES payment_rails(rail_id),
    product_id UUID REFERENCES payment_products(product_id),
    workflow_code VARCHAR(50) NOT NULL,
    workflow_name VARCHAR(100) NOT NULL,
    workflow_description TEXT,
    workflow_version VARCHAR(20) DEFAULT '1.0',
    direction payment_direction NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    -- Dynamic workflow configuration
    workflow_config JSONB DEFAULT '{}',
    retry_policy JSONB DEFAULT '{
        "max_retries": 3,
        "retry_delay_seconds": 60,
        "exponential_backoff": true,
        "backoff_multiplier": 2
    }',
    timeout_config JSONB DEFAULT '{
        "workflow_timeout_minutes": 60,
        "step_timeout_minutes": 5
    }',
    hitl_config JSONB DEFAULT '{
        "enabled": true,
        "auto_escalate_after_minutes": 30,
        "require_approval_for": ["SUSPICIOUS", "ERROR", "AMOUNT_THRESHOLD"]
    }',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    UNIQUE(rail_id, product_id, workflow_code, workflow_version)
);

CREATE INDEX idx_workflow_defs_rail ON workflow_definitions(rail_id);
CREATE INDEX idx_workflow_defs_product ON workflow_definitions(product_id);
CREATE INDEX idx_workflow_defs_code ON workflow_definitions(workflow_code);

-- Workflow Steps
CREATE TABLE workflow_steps (
    step_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflow_definitions(workflow_id),
    step_sequence INT NOT NULL,
    step_code VARCHAR(50) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_description TEXT,
    step_type workflow_step_type NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_async BOOLEAN DEFAULT FALSE,
    is_hitl_checkpoint BOOLEAN DEFAULT FALSE,
    -- Conditional execution
    condition_expression TEXT,                          -- JSONB path or expression
    skip_on_condition BOOLEAN DEFAULT FALSE,
    -- Error handling
    on_error_action VARCHAR(50) DEFAULT 'FAIL',        -- FAIL, SKIP, RETRY, HITL
    max_retries INT DEFAULT 3,
    retry_delay_seconds INT DEFAULT 60,
    -- Step configuration
    step_config JSONB DEFAULT '{}',
    input_mapping JSONB DEFAULT '{}',
    output_mapping JSONB DEFAULT '{}',
    validation_schema JSONB DEFAULT '{}',
    -- HITL configuration for this step
    hitl_triggers JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workflow_id, step_sequence),
    UNIQUE(workflow_id, step_code)
);

CREATE INDEX idx_workflow_steps_workflow ON workflow_steps(workflow_id);
CREATE INDEX idx_workflow_steps_type ON workflow_steps(step_type);

-- Step Transitions (State Machine)
CREATE TABLE workflow_step_transitions (
    transition_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflow_definitions(workflow_id),
    from_step_id UUID REFERENCES workflow_steps(step_id),  -- NULL for start
    to_step_id UUID REFERENCES workflow_steps(step_id),    -- NULL for end
    transition_trigger step_execution_status NOT NULL,
    condition_expression TEXT,
    priority INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_step_transitions_workflow ON workflow_step_transitions(workflow_id);
CREATE INDEX idx_step_transitions_from ON workflow_step_transitions(from_step_id);

-- ============================================================================
-- SECTION 5: VALIDATION AND ROUTING RULES
-- ============================================================================

-- Validation Rules
CREATE TABLE validation_rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rail_id UUID REFERENCES payment_rails(rail_id),
    product_id UUID REFERENCES payment_products(product_id),
    rule_code VARCHAR(50) NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    rule_description TEXT,
    rule_category VARCHAR(50),                          -- FORMAT, BUSINESS, COMPLIANCE, LIMIT
    rule_priority INT DEFAULT 100,
    rule_expression JSONB NOT NULL,                     -- Rule definition in JSON
    error_code VARCHAR(50),
    error_message TEXT,
    is_blocking BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_validation_rules_rail ON validation_rules(rail_id);
CREATE INDEX idx_validation_rules_product ON validation_rules(product_id);
CREATE INDEX idx_validation_rules_category ON validation_rules(rule_category);

-- Routing Rules
CREATE TABLE routing_rules (
    routing_rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_code VARCHAR(50) NOT NULL UNIQUE,
    rule_name VARCHAR(100) NOT NULL,
    rule_description TEXT,
    rule_priority INT DEFAULT 100,
    -- Conditions for routing
    condition_country_from UUID REFERENCES countries(country_id),
    condition_country_to UUID REFERENCES countries(country_id),
    condition_currency UUID REFERENCES currencies(currency_id),
    condition_amount_min DECIMAL(18,2),
    condition_amount_max DECIMAL(18,2),
    condition_expression JSONB,                         -- Complex conditions
    -- Target rail/product
    target_rail_id UUID NOT NULL REFERENCES payment_rails(rail_id),
    target_product_id UUID REFERENCES payment_products(product_id),
    -- Fallback options
    fallback_rail_id UUID REFERENCES payment_rails(rail_id),
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_routing_rules_priority ON routing_rules(rule_priority);
CREATE INDEX idx_routing_rules_target ON routing_rules(target_rail_id);

-- ============================================================================
-- SECTION 6: TRANSACTION DATA TABLES
-- ============================================================================

-- Main Payment Transactions Table
CREATE TABLE payment_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Reference identifiers
    transaction_ref VARCHAR(50) NOT NULL UNIQUE,        -- Internal reference
    end_to_end_id VARCHAR(35),                          -- ISO 20022 EndToEndId
    instruction_id VARCHAR(35),                         -- ISO 20022 InstructionId
    uetr VARCHAR(36),                                   -- Unique End-to-end Transaction Reference
    -- Rail and product
    rail_id UUID NOT NULL REFERENCES payment_rails(rail_id),
    product_id UUID REFERENCES payment_products(product_id),
    workflow_id UUID REFERENCES workflow_definitions(workflow_id),
    -- Common attributes
    direction payment_direction NOT NULL,
    status transaction_status NOT NULL DEFAULT 'INITIATED',
    previous_status transaction_status,
    -- Amount information
    instructed_amount DECIMAL(18,2) NOT NULL,
    instructed_currency_id UUID NOT NULL REFERENCES currencies(currency_id),
    settlement_amount DECIMAL(18,2),
    settlement_currency_id UUID REFERENCES currencies(currency_id),
    exchange_rate DECIMAL(18,8),
    charges_amount DECIMAL(18,2) DEFAULT 0,
    charge_bearer VARCHAR(20) DEFAULT 'SLEV',           -- DEBT, CRED, SHAR, SLEV
    -- Date/Time
    creation_datetime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    value_date DATE,
    settlement_date DATE,
    completed_datetime TIMESTAMPTZ,
    -- Purpose and remittance
    purpose_code VARCHAR(10),
    purpose_description VARCHAR(140),
    remittance_info TEXT,
    -- Batch information
    batch_id UUID,
    batch_sequence INT,
    -- Processing info
    current_step_id UUID REFERENCES workflow_steps(step_id),
    retry_count INT DEFAULT 0,
    is_suspicious BOOLEAN DEFAULT FALSE,
    requires_hitl BOOLEAN DEFAULT FALSE,
    -- Dynamic/Rail-specific attributes (THE KEY FLEXIBLE COLUMN)
    rail_specific_data JSONB DEFAULT '{}',
    -- Original message storage
    original_message JSONB,
    transformed_message JSONB,
    response_message JSONB,
    -- Audit
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Indexes for payment_transactions
CREATE INDEX idx_txn_ref ON payment_transactions(transaction_ref);
CREATE INDEX idx_txn_e2e ON payment_transactions(end_to_end_id);
CREATE INDEX idx_txn_uetr ON payment_transactions(uetr);
CREATE INDEX idx_txn_rail ON payment_transactions(rail_id);
CREATE INDEX idx_txn_product ON payment_transactions(product_id);
CREATE INDEX idx_txn_status ON payment_transactions(status);
CREATE INDEX idx_txn_direction ON payment_transactions(direction);
CREATE INDEX idx_txn_created ON payment_transactions(creation_datetime);
CREATE INDEX idx_txn_value_date ON payment_transactions(value_date);
CREATE INDEX idx_txn_suspicious ON payment_transactions(is_suspicious) WHERE is_suspicious = TRUE;
CREATE INDEX idx_txn_hitl ON payment_transactions(requires_hitl) WHERE requires_hitl = TRUE;
CREATE INDEX idx_txn_rail_specific ON payment_transactions USING GIN(rail_specific_data);

-- Transaction Parties (Debtor, Creditor, Intermediaries)
CREATE TABLE transaction_parties (
    party_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES payment_transactions(transaction_id),
    party_type party_type NOT NULL,
    party_sequence INT DEFAULT 1,
    -- Party identification
    party_name VARCHAR(140),
    party_account_number VARCHAR(50),
    party_account_type VARCHAR(20),
    party_bic VARCHAR(11),
    party_lei VARCHAR(20),
    party_routing_number VARCHAR(20),
    -- Address
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    state_province VARCHAR(50),
    postal_code VARCHAR(20),
    country_id UUID REFERENCES countries(country_id),
    -- Agent/Bank information
    agent_name VARCHAR(140),
    agent_bic VARCHAR(11),
    agent_routing_number VARCHAR(20),
    agent_account VARCHAR(50),
    -- Dynamic party attributes
    party_details JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_party_txn ON transaction_parties(transaction_id);
CREATE INDEX idx_party_type ON transaction_parties(party_type);
CREATE INDEX idx_party_account ON transaction_parties(party_account_number);
CREATE INDEX idx_party_bic ON transaction_parties(party_bic);

-- ============================================================================
-- SECTION 7: PROCESS LOGS AND EVENT STREAMING
-- ============================================================================

-- Payment Process Logs (Event Stream for Transaction Journey)
CREATE TABLE payment_process_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES payment_transactions(transaction_id),
    workflow_id UUID REFERENCES workflow_definitions(workflow_id),
    step_id UUID REFERENCES workflow_steps(step_id),
    -- Event identification
    event_id VARCHAR(50) NOT NULL,
    event_sequence BIGINT NOT NULL,                     -- Monotonic sequence for ordering
    event_type VARCHAR(50) NOT NULL,                    -- STEP_STARTED, STEP_COMPLETED, STATUS_CHANGED, etc.
    event_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    -- Status information
    execution_status step_execution_status NOT NULL,
    previous_status step_execution_status,
    transaction_status transaction_status,
    -- Execution details
    step_code VARCHAR(50),
    step_name VARCHAR(100),
    duration_ms BIGINT,
    -- Input/Output snapshots
    input_data JSONB,
    output_data JSONB,
    -- Context for HITL
    execution_context hitl_context,
    is_hitl_triggered BOOLEAN DEFAULT FALSE,
    hitl_reason TEXT,
    -- Retry information
    retry_attempt INT DEFAULT 0,
    is_retry BOOLEAN DEFAULT FALSE,
    parent_log_id UUID REFERENCES payment_process_logs(log_id),
    -- Correlation for distributed tracing
    correlation_id VARCHAR(50),
    trace_id VARCHAR(50),
    span_id VARCHAR(50),
    -- Processing node information
    processor_id VARCHAR(100),
    processor_host VARCHAR(100),
    -- Additional details
    message TEXT,
    details JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for process logs
CREATE INDEX idx_process_log_txn ON payment_process_logs(transaction_id);
CREATE INDEX idx_process_log_workflow ON payment_process_logs(workflow_id);
CREATE INDEX idx_process_log_step ON payment_process_logs(step_id);
CREATE INDEX idx_process_log_event_type ON payment_process_logs(event_type);
CREATE INDEX idx_process_log_status ON payment_process_logs(execution_status);
CREATE INDEX idx_process_log_timestamp ON payment_process_logs(event_timestamp);
CREATE INDEX idx_process_log_sequence ON payment_process_logs(transaction_id, event_sequence);
CREATE INDEX idx_process_log_hitl ON payment_process_logs(is_hitl_triggered) WHERE is_hitl_triggered = TRUE;
CREATE INDEX idx_process_log_correlation ON payment_process_logs(correlation_id);
CREATE INDEX idx_process_log_trace ON payment_process_logs(trace_id);

-- Sequence for event ordering
CREATE SEQUENCE payment_event_sequence START 1;

-- Payment Error Logs
CREATE TABLE payment_error_logs (
    error_log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES payment_transactions(transaction_id),
    process_log_id UUID REFERENCES payment_process_logs(log_id),
    workflow_id UUID REFERENCES workflow_definitions(workflow_id),
    step_id UUID REFERENCES workflow_steps(step_id),
    -- Error identification
    error_id VARCHAR(50) NOT NULL,
    error_code VARCHAR(50) NOT NULL,
    error_category VARCHAR(50),                         -- VALIDATION, TECHNICAL, BUSINESS, COMPLIANCE, TIMEOUT
    error_severity error_severity NOT NULL DEFAULT 'ERROR',
    -- Error details
    error_message TEXT NOT NULL,
    error_description TEXT,
    stack_trace TEXT,
    -- Original cause
    root_cause_code VARCHAR(50),
    root_cause_message TEXT,
    -- Source information
    source_system VARCHAR(100),
    source_component VARCHAR(100),
    -- Resolution tracking
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by VARCHAR(100),
    resolution_notes TEXT,
    resolution_action VARCHAR(50),
    -- HITL context
    requires_hitl BOOLEAN DEFAULT FALSE,
    hitl_context hitl_context,
    -- Additional details
    request_payload JSONB,
    response_payload JSONB,
    error_details JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for error logs
CREATE INDEX idx_error_log_txn ON payment_error_logs(transaction_id);
CREATE INDEX idx_error_log_process ON payment_error_logs(process_log_id);
CREATE INDEX idx_error_log_code ON payment_error_logs(error_code);
CREATE INDEX idx_error_log_category ON payment_error_logs(error_category);
CREATE INDEX idx_error_log_severity ON payment_error_logs(error_severity);
CREATE INDEX idx_error_log_resolved ON payment_error_logs(is_resolved);
CREATE INDEX idx_error_log_timestamp ON payment_error_logs(created_at);

-- ============================================================================
-- SECTION 8: HUMAN IN THE LOOP (HITL) TABLES
-- ============================================================================

-- HITL Intervention Queue
CREATE TABLE hitl_interventions (
    intervention_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES payment_transactions(transaction_id),
    process_log_id UUID REFERENCES payment_process_logs(log_id),
    error_log_id UUID REFERENCES payment_error_logs(error_log_id),
    workflow_id UUID REFERENCES workflow_definitions(workflow_id),
    step_id UUID REFERENCES workflow_steps(step_id),
    -- Queue management
    queue_name VARCHAR(50) DEFAULT 'DEFAULT',
    priority INT DEFAULT 5,                             -- 1=Highest, 10=Lowest
    -- Context
    intervention_context hitl_context NOT NULL,
    trigger_reason TEXT NOT NULL,
    -- Current state snapshot
    transaction_status transaction_status,
    step_status step_execution_status,
    -- Assignment
    assigned_to VARCHAR(100),
    assigned_at TIMESTAMPTZ,
    assigned_by VARCHAR(100),
    -- SLA tracking
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMPTZ,
    escalation_at TIMESTAMPTZ,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_to VARCHAR(100),
    -- Resolution
    action_taken hitl_action_type,
    action_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by VARCHAR(100),
    -- Data for review
    review_data JSONB DEFAULT '{}',
    modification_data JSONB,                            -- If action is MODIFY
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_resolved BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for HITL interventions
CREATE INDEX idx_hitl_txn ON hitl_interventions(transaction_id);
CREATE INDEX idx_hitl_queue ON hitl_interventions(queue_name);
CREATE INDEX idx_hitl_priority ON hitl_interventions(priority);
CREATE INDEX idx_hitl_context ON hitl_interventions(intervention_context);
CREATE INDEX idx_hitl_assigned ON hitl_interventions(assigned_to);
CREATE INDEX idx_hitl_active ON hitl_interventions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_hitl_due ON hitl_interventions(due_at);
CREATE INDEX idx_hitl_escalated ON hitl_interventions(is_escalated) WHERE is_escalated = TRUE;

-- HITL Audit Trail (All actions taken on interventions)
CREATE TABLE hitl_audit_trail (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_id UUID NOT NULL REFERENCES hitl_interventions(intervention_id),
    transaction_id UUID NOT NULL REFERENCES payment_transactions(transaction_id),
    -- Action details
    action_type hitl_action_type NOT NULL,
    action_by VARCHAR(100) NOT NULL,
    action_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    -- Before/After state
    previous_state JSONB,
    new_state JSONB,
    -- Reason and notes
    action_reason TEXT,
    action_notes TEXT,
    -- Additional context
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_hitl_audit_intervention ON hitl_audit_trail(intervention_id);
CREATE INDEX idx_hitl_audit_txn ON hitl_audit_trail(transaction_id);
CREATE INDEX idx_hitl_audit_action ON hitl_audit_trail(action_type);
CREATE INDEX idx_hitl_audit_user ON hitl_audit_trail(action_by);
CREATE INDEX idx_hitl_audit_timestamp ON hitl_audit_trail(action_at);

-- ============================================================================
-- SECTION 9: CONFIGURATION AND SETTINGS
-- ============================================================================

-- System Configuration
CREATE TABLE system_configuration (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    config_type VARCHAR(20) DEFAULT 'STRING',           -- STRING, NUMBER, BOOLEAN, JSON
    category VARCHAR(50),
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from TIMESTAMPTZ,
    effective_to TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_sys_config_key ON system_configuration(config_key);
CREATE INDEX idx_sys_config_category ON system_configuration(category);

-- Fee Configuration per Rail/Product
CREATE TABLE fee_configuration (
    fee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rail_id UUID NOT NULL REFERENCES payment_rails(rail_id),
    product_id UUID REFERENCES payment_products(product_id),
    fee_code VARCHAR(50) NOT NULL,
    fee_name VARCHAR(100) NOT NULL,
    fee_type VARCHAR(20) NOT NULL,                      -- FLAT, PERCENTAGE, TIERED
    fee_amount DECIMAL(18,4),
    fee_percentage DECIMAL(8,6),
    min_fee DECIMAL(18,2),
    max_fee DECIMAL(18,2),
    currency_id UUID REFERENCES currencies(currency_id),
    -- Conditions
    amount_from DECIMAL(18,2),
    amount_to DECIMAL(18,2),
    -- Tiered structure
    tier_config JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fee_config_rail ON fee_configuration(rail_id);
CREATE INDEX idx_fee_config_product ON fee_configuration(product_id);

-- ============================================================================
-- SECTION 10: AUDIT AND COMPLIANCE
-- ============================================================================

-- General Audit Trail
CREATE TABLE audit_trail (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,                        -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    changed_by VARCHAR(100),
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    correlation_id VARCHAR(50),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_audit_table ON audit_trail(table_name);
CREATE INDEX idx_audit_record ON audit_trail(record_id);
CREATE INDEX idx_audit_action ON audit_trail(action);
CREATE INDEX idx_audit_timestamp ON audit_trail(changed_at);
CREATE INDEX idx_audit_user ON audit_trail(changed_by);

-- ============================================================================
-- SECTION 11: VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Transaction Journey View
CREATE OR REPLACE VIEW vw_transaction_journey AS
SELECT 
    t.transaction_id,
    t.transaction_ref,
    t.end_to_end_id,
    t.status AS current_status,
    t.direction,
    t.instructed_amount,
    cur.currency_code,
    r.rail_code,
    r.rail_name,
    p.product_code,
    p.product_name,
    t.creation_datetime,
    t.completed_datetime,
    pl.event_sequence,
    pl.event_type,
    pl.execution_status AS step_status,
    pl.step_code,
    pl.step_name,
    pl.event_timestamp,
    pl.duration_ms,
    pl.is_hitl_triggered,
    pl.execution_context,
    pl.message
FROM payment_transactions t
JOIN payment_rails r ON t.rail_id = r.rail_id
LEFT JOIN payment_products p ON t.product_id = p.product_id
JOIN currencies cur ON t.instructed_currency_id = cur.currency_id
LEFT JOIN payment_process_logs pl ON t.transaction_id = pl.transaction_id
ORDER BY t.transaction_id, pl.event_sequence;

-- Active HITL Queue View
CREATE OR REPLACE VIEW vw_active_hitl_queue AS
SELECT 
    h.intervention_id,
    h.queue_name,
    h.priority,
    h.intervention_context,
    h.trigger_reason,
    t.transaction_ref,
    t.end_to_end_id,
    t.instructed_amount,
    cur.currency_code,
    r.rail_code,
    h.assigned_to,
    h.assigned_at,
    h.created_at,
    h.due_at,
    h.is_escalated,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - h.created_at))/60 AS waiting_minutes
FROM hitl_interventions h
JOIN payment_transactions t ON h.transaction_id = t.transaction_id
JOIN payment_rails r ON t.rail_id = r.rail_id
JOIN currencies cur ON t.instructed_currency_id = cur.currency_id
WHERE h.is_active = TRUE AND h.is_resolved = FALSE
ORDER BY h.priority, h.created_at;

-- Error Summary View
CREATE OR REPLACE VIEW vw_error_summary AS
SELECT 
    e.error_log_id,
    e.error_code,
    e.error_category,
    e.error_severity,
    e.error_message,
    t.transaction_ref,
    t.status AS transaction_status,
    r.rail_code,
    ws.step_name,
    e.is_resolved,
    e.requires_hitl,
    e.created_at
FROM payment_error_logs e
LEFT JOIN payment_transactions t ON e.transaction_id = t.transaction_id
LEFT JOIN payment_rails r ON t.rail_id = r.rail_id
LEFT JOIN workflow_steps ws ON e.step_id = ws.step_id
ORDER BY e.created_at DESC;

-- ============================================================================
-- SECTION 12: FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_update_%I_timestamp ON %I;
            CREATE TRIGGER trg_update_%I_timestamp
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to get next event sequence for a transaction
CREATE OR REPLACE FUNCTION get_next_event_sequence(p_transaction_id UUID)
RETURNS BIGINT AS $$
DECLARE
    v_sequence BIGINT;
BEGIN
    SELECT COALESCE(MAX(event_sequence), 0) + 1
    INTO v_sequence
    FROM payment_process_logs
    WHERE transaction_id = p_transaction_id;
    
    RETURN v_sequence;
END;
$$ LANGUAGE plpgsql;

-- Function to generate transaction reference
CREATE OR REPLACE FUNCTION generate_transaction_ref(p_rail_code VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    v_ref VARCHAR(50);
    v_date VARCHAR(8);
    v_seq VARCHAR(10);
BEGIN
    v_date := TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD');
    v_seq := LPAD(nextval('payment_event_sequence')::TEXT, 10, '0');
    v_ref := UPPER(p_rail_code) || '-' || v_date || '-' || v_seq;
    RETURN v_ref;
END;
$$ LANGUAGE plpgsql;

-- Function to log process event
CREATE OR REPLACE FUNCTION log_process_event(
    p_transaction_id UUID,
    p_workflow_id UUID,
    p_step_id UUID,
    p_event_type VARCHAR,
    p_execution_status step_execution_status,
    p_message TEXT DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_sequence BIGINT;
    v_step_code VARCHAR;
    v_step_name VARCHAR;
BEGIN
    -- Get next sequence
    v_sequence := get_next_event_sequence(p_transaction_id);
    
    -- Get step details if provided
    IF p_step_id IS NOT NULL THEN
        SELECT step_code, step_name INTO v_step_code, v_step_name
        FROM workflow_steps WHERE step_id = p_step_id;
    END IF;
    
    -- Insert log entry
    INSERT INTO payment_process_logs (
        transaction_id, workflow_id, step_id,
        event_id, event_sequence, event_type,
        execution_status, step_code, step_name,
        message, details
    ) VALUES (
        p_transaction_id, p_workflow_id, p_step_id,
        uuid_generate_v4()::VARCHAR, v_sequence, p_event_type,
        p_execution_status, v_step_code, v_step_name,
        p_message, p_details
    ) RETURNING log_id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create HITL intervention
CREATE OR REPLACE FUNCTION create_hitl_intervention(
    p_transaction_id UUID,
    p_process_log_id UUID,
    p_context hitl_context,
    p_reason TEXT,
    p_queue_name VARCHAR DEFAULT 'DEFAULT',
    p_priority INT DEFAULT 5
)
RETURNS UUID AS $$
DECLARE
    v_intervention_id UUID;
    v_txn_status transaction_status;
    v_step_status step_execution_status;
    v_workflow_id UUID;
    v_step_id UUID;
BEGIN
    -- Get current transaction state
    SELECT status, workflow_id, current_step_id
    INTO v_txn_status, v_workflow_id, v_step_id
    FROM payment_transactions
    WHERE transaction_id = p_transaction_id;
    
    -- Get step status from process log
    IF p_process_log_id IS NOT NULL THEN
        SELECT execution_status INTO v_step_status
        FROM payment_process_logs WHERE log_id = p_process_log_id;
    END IF;
    
    -- Create intervention
    INSERT INTO hitl_interventions (
        transaction_id, process_log_id, workflow_id, step_id,
        queue_name, priority, intervention_context, trigger_reason,
        transaction_status, step_status,
        due_at
    ) VALUES (
        p_transaction_id, p_process_log_id, v_workflow_id, v_step_id,
        p_queue_name, p_priority, p_context, p_reason,
        v_txn_status, v_step_status,
        CURRENT_TIMESTAMP + INTERVAL '30 minutes'
    ) RETURNING intervention_id INTO v_intervention_id;
    
    -- Update transaction to mark HITL required
    UPDATE payment_transactions
    SET requires_hitl = TRUE, status = 'PENDING_REVIEW'
    WHERE transaction_id = p_transaction_id;
    
    RETURN v_intervention_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 13: PARTITIONING FOR LARGE TABLES (OPTIONAL)
-- ============================================================================

-- Note: For production, consider partitioning payment_process_logs by date
-- Example (commented out - enable based on requirements):

-- CREATE TABLE payment_process_logs_partitioned (
--     LIKE payment_process_logs INCLUDING ALL
-- ) PARTITION BY RANGE (event_timestamp);

-- CREATE TABLE payment_process_logs_2024_01 PARTITION OF payment_process_logs_partitioned
--     FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- ============================================================================
-- END OF DDL SCRIPT
-- ============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed for PayFlow Global Payment HUB - US PAYMENTS (FedNow Focus)...');

  // ============================================================================
  // 1. COUNTRIES
  // ============================================================================
  console.log('📍 Seeding Countries...');
  const usa = await prisma.country.upsert({
    where: { countryCode: 'USA' },
    update: {},
    create: {
      countryCode: 'USA',
      countryCodeAlpha2: 'US',
      countryName: 'United States',
      numericCode: '840',
      isActive: true,
      region: 'Americas',
      subRegion: 'Northern America',
      metadata: {
        timezone: 'America/New_York',
        calling_code: '+1',
        internet_tld: '.us',
      },
    },
  });
  console.log(`✓ Created country: ${usa.countryName}`);

  // ============================================================================
  // 2. CURRENCIES
  // ============================================================================
  console.log('💵 Seeding Currencies...');
  const usd = await prisma.currency.upsert({
    where: { currencyCode: 'USD' },
    update: {},
    create: {
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      numericCode: '840',
      minorUnits: 2,
      symbol: '$',
      isActive: true,
      metadata: {
        decimal_separator: '.',
        thousands_separator: ',',
        symbol_position: 'before',
      },
    },
  });
  console.log(`✓ Created currency: ${usd.currencyName}`);

  // ============================================================================
  // 3. PAYMENT RAIL - FedNow
  // ============================================================================
  console.log('🚄 Seeding Payment Rail - FedNow...');
  const fedNow = await prisma.paymentRail.upsert({
    where: { railCode: 'FEDNOW' },
    update: {},
    create: {
      railCode: 'FEDNOW',
      railName: 'FedNow Service',
      railDescription: 'Federal Reserve Instant Payment Service - 24/7/365 real-time payment processing',
      railType: 'REAL_TIME',
      operatorName: 'Federal Reserve Banks',
      operatorCountryId: usa.id,
      isRealTime: true,
      is24x7: true,
      settlementType: 'INSTANT',
      maxAmount: 500000.00,
      minAmount: 0.01,
      cutoffTime: null, // No cutoff - 24x7
      timezone: 'America/New_York',
      messageFormat: 'ISO20022',
      version: '1.0',
      isActive: true,
      railConfig: {
        service_type: 'instant_payment',
        operating_hours: '24x7x365',
        settlement_window: 'real_time',
        supported_message_types: ['pacs.008', 'pacs.002', 'pacs.004', 'camt.056'],
        transaction_limit_per_day: 1000000.00,
        batch_processing: false,
        supports_request_for_payment: true,
        supports_return: true,
        max_return_days: 1,
      },
      apiConfig: {
        base_url: 'https://api.fednow.gov/v1',
        authentication_type: 'OAuth2',
        timeout_seconds: 30,
        retry_count: 3,
        endpoints: {
          credit_transfer: '/payments/credit-transfer',
          payment_status: '/payments/status',
          return_payment: '/payments/return',
          request_for_payment: '/payments/request',
        },
      },
      securityConfig: {
        encryption: 'AES-256-GCM',
        signing_algorithm: 'RSA-SHA256',
        certificate_validation: true,
        tls_version: '1.3',
        message_authentication: 'HMAC-SHA256',
      },
      metadata: {
        launch_date: '2023-07-20',
        operator_website: 'https://www.frbservices.org/financial-services/fednow',
        supported_institutions: 'US_Banks_Credit_Unions',
        compliance: ['BSA', 'OFAC', 'Reg E'],
      },
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });
  console.log(`✓ Created payment rail: ${fedNow.railName}`);

  // ============================================================================
  // 4. PAYMENT PRODUCTS for FedNow
  // ============================================================================
  console.log('📦 Seeding Payment Products for FedNow...');

  const creditTransferProduct = await prisma.paymentProduct.upsert({
    where: {
      railId_productCode: {
        railId: fedNow.id,
        productCode: 'FN-CREDIT-TRANSFER',
      },
    },
    update: {},
    create: {
      railId: fedNow.id,
      productCode: 'FN-CREDIT-TRANSFER',
      productName: 'FedNow Credit Transfer',
      productDescription: 'Instant credit transfer for immediate funds availability',
      productType: 'CREDIT_TRANSFER',
      isInstant: true,
      requiresResponse: true,
      maxAmount: 500000.00,
      minAmount: 0.01,
      feeStructure: {
        transaction_fee: 0.045,
        currency: 'USD',
        fee_type: 'per_transaction',
        monthly_volume_discount: true,
      },
      productConfig: {
        message_type: 'pacs.008.001.08',
        settlement_method: 'INDA',
        clearing_system: 'FDN',
        instruction_priority: 'HIGH',
        supports_structured_remittance: true,
      },
      validationRules: {
        required_fields: ['debtor', 'creditor', 'amount', 'end_to_end_id'],
        debtor_account_required: true,
        creditor_account_required: true,
        remittance_info_max_length: 140,
      },
      isActive: true,
      metadata: {
        use_cases: ['P2P', 'B2B', 'B2C', 'payroll', 'bill_payment'],
      },
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });
  console.log(`✓ Created product: ${creditTransferProduct.productName}`);

  const requestForPaymentProduct = await prisma.paymentProduct.upsert({
    where: {
      railId_productCode: {
        railId: fedNow.id,
        productCode: 'FN-REQUEST-FOR-PAYMENT',
      },
    },
    update: {},
    create: {
      railId: fedNow.id,
      productCode: 'FN-REQUEST-FOR-PAYMENT',
      productName: 'FedNow Request for Payment',
      productDescription: 'Request payment from another party with instant notification',
      productType: 'REQUEST_FOR_PAYMENT',
      isInstant: true,
      requiresResponse: true,
      maxAmount: 500000.00,
      minAmount: 0.01,
      feeStructure: {
        transaction_fee: 0.015,
        currency: 'USD',
        fee_type: 'per_request',
      },
      productConfig: {
        message_type: 'pain.013.001.07',
        expiry_time_hours: 72,
        allows_partial_payment: false,
      },
      validationRules: {
        required_fields: ['creditor', 'debtor', 'amount', 'request_id'],
        expiry_date_required: true,
      },
      isActive: true,
      metadata: {
        use_cases: ['invoicing', 'bill_payment', 'account_receivable'],
      },
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });
  console.log(`✓ Created product: ${requestForPaymentProduct.productName}`);

  const returnProduct = await prisma.paymentProduct.upsert({
    where: {
      railId_productCode: {
        railId: fedNow.id,
        productCode: 'FN-PAYMENT-RETURN',
      },
    },
    update: {},
    create: {
      railId: fedNow.id,
      productCode: 'FN-PAYMENT-RETURN',
      productName: 'FedNow Payment Return',
      productDescription: 'Return a previously processed payment',
      productType: 'RETURN',
      isInstant: true,
      requiresResponse: false,
      maxAmount: 500000.00,
      minAmount: 0.01,
      feeStructure: {
        transaction_fee: 0.045,
        currency: 'USD',
        fee_type: 'per_return',
      },
      productConfig: {
        message_type: 'pacs.004.001.09',
        return_window_hours: 24,
        return_reasons: [
          'AC01', // IncorrectAccountNumber
          'AC04', // ClosedAccountNumber
          'AC06', // BlockedAccount
          'AM05', // Duplication
          'NARR', // Narrative
        ],
      },
      validationRules: {
        required_fields: ['original_transaction_ref', 'return_reason', 'amount'],
        original_message_required: true,
      },
      isActive: true,
      metadata: {
        use_cases: ['incorrect_account', 'duplicate_payment', 'fraud_prevention'],
      },
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });
  console.log(`✓ Created product: ${returnProduct.productName}`);

  // ============================================================================
  // 5. PAYMENT RAIL COUNTRIES
  // ============================================================================
  console.log('🗺️  Seeding Payment Rail Countries...');
  const railCountry = await prisma.paymentRailCountry.upsert({
    where: {
      railId_countryId: {
        railId: fedNow.id,
        countryId: usa.id,
      },
    },
    update: {},
    create: {
      railId: fedNow.id,
      countryId: usa.id,
      isDomestic: true,
      isCrossBorder: false,
      isActive: true,
      effectiveFrom: new Date('2023-07-20'),
      effectiveTo: null,
      countrySpecificConfig: {
        regulatory_framework: 'Federal Reserve Act',
        operating_rules: 'FedNow Service Operating Rules',
        participation_requirements: 'US_Federal_Reserve_Account',
        business_days: [1, 2, 3, 4, 5],
        holidays: 'US_Federal_Reserve_Holidays',
      },
      metadata: {
        participating_institutions: 'All US banks with Fed account',
      },
    },
  });
  console.log(`✓ Mapped FedNow to USA`);

  // ============================================================================
  // 6. PAYMENT RAIL CURRENCIES
  // ============================================================================
  console.log('💱 Seeding Payment Rail Currencies...');
  const railCurrency = await prisma.paymentRailCurrency.upsert({
    where: {
      railId_currencyId: {
        railId: fedNow.id,
        currencyId: usd.id,
      },
    },
    update: {},
    create: {
      railId: fedNow.id,
      currencyId: usd.id,
      isPrimary: true,
      isActive: true,
      exchangeRateSource: 'N/A',
      currencySpecificConfig: {
        settlement_currency: 'USD',
        supports_fx: false,
        decimal_places: 2,
      },
      metadata: {
        note: 'FedNow only supports USD',
      },
    },
  });
  console.log(`✓ Mapped FedNow to USD`);

  // ============================================================================
  // 7. WORKFLOW DEFINITIONS
  // ============================================================================
  console.log('⚙️  Seeding Workflow Definitions...');

  const outboundWorkflow = await prisma.workflowDefinition.create({
    data: {
      railId: fedNow.id,
      productId: creditTransferProduct.id,
      workflowCode: 'FN-OUTBOUND-CT',
      workflowName: 'FedNow Outbound Credit Transfer',
      workflowDescription: 'Complete workflow for processing outbound FedNow credit transfers',
      workflowVersion: '1.0',
      direction: 'OUTBOUND',
      isDefault: true,
      isActive: true,
      workflowConfig: {
        enable_async_processing: false,
        enable_notifications: true,
        notification_channels: ['email', 'webhook'],
      },
      retryPolicy: {
        max_retries: 3,
        retry_delay_seconds: 60,
        exponential_backoff: true,
        backoff_multiplier: 2,
        max_delay_seconds: 300,
      },
      timeoutConfig: {
        workflow_timeout_minutes: 60,
        step_timeout_minutes: 5,
      },
      hitlConfig: {
        enabled: true,
        auto_escalate_after_minutes: 30,
        require_approval_for: ['SUSPICIOUS', 'ERROR', 'AMOUNT_THRESHOLD'],
        amount_threshold: 100000.00,
      },
      metadata: {
        sla_minutes: 1,
        business_priority: 'HIGH',
      },
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });
  console.log(`✓ Created workflow: ${outboundWorkflow.workflowName}`);

  // ============================================================================
  // 8. WORKFLOW STEPS
  // ============================================================================
  console.log('📋 Seeding Workflow Steps...');

  const step1 = await prisma.workflowStep.create({
    data: {
      workflowId: outboundWorkflow.id,
      stepSequence: 1,
      stepCode: 'VALIDATE',
      stepName: 'Validate Payment Request',
      stepDescription: 'Validate payment request against FedNow rules',
      stepType: 'VALIDATION',
      isMandatory: true,
      isAsync: false,
      isHitlCheckpoint: false,
      onErrorAction: 'FAIL',
      maxRetries: 0,
      retryDelaySeconds: 0,
      stepConfig: {
        validation_types: ['format', 'business', 'amount', 'account'],
      },
      inputMapping: {
        transaction_data: 'payload.transaction',
      },
      outputMapping: {
        validation_result: 'result.validation',
      },
      validationSchema: {},
      hitlTriggers: [],
      isActive: true,
      metadata: {},
    },
  });

  const step2 = await prisma.workflowStep.create({
    data: {
      workflowId: outboundWorkflow.id,
      stepSequence: 2,
      stepCode: 'FRAUD_CHECK',
      stepName: 'Fraud Detection Check',
      stepDescription: 'Run fraud detection algorithms',
      stepType: 'FRAUD_CHECK',
      isMandatory: true,
      isAsync: false,
      isHitlCheckpoint: true,
      onErrorAction: 'HITL',
      maxRetries: 0,
      retryDelaySeconds: 0,
      stepConfig: {
        fraud_engine: 'advanced_ml',
        risk_threshold: 0.7,
      },
      inputMapping: {
        transaction: 'payload.transaction',
        debtor: 'payload.debtor',
        creditor: 'payload.creditor',
      },
      outputMapping: {
        fraud_score: 'result.fraud_score',
        risk_level: 'result.risk_level',
      },
      validationSchema: {},
      hitlTriggers: ['SUSPICIOUS', 'HIGH_RISK'],
      isActive: true,
      metadata: {},
    },
  });

  const step3 = await prisma.workflowStep.create({
    data: {
      workflowId: outboundWorkflow.id,
      stepSequence: 3,
      stepCode: 'COMPLIANCE_CHECK',
      stepName: 'AML/Compliance Screening',
      stepDescription: 'Screen against OFAC, AML watchlists',
      stepType: 'COMPLIANCE_CHECK',
      isMandatory: true,
      isAsync: false,
      isHitlCheckpoint: true,
      onErrorAction: 'HITL',
      maxRetries: 2,
      retryDelaySeconds: 30,
      stepConfig: {
        screening_lists: ['OFAC', 'EU_Sanctions', 'UN_Sanctions'],
        match_threshold: 0.85,
      },
      inputMapping: {
        parties: 'payload.parties',
      },
      outputMapping: {
        screening_result: 'result.screening',
        matches: 'result.matches',
      },
      validationSchema: {},
      hitlTriggers: ['MATCH_FOUND', 'COMPLIANCE_REVIEW'],
      isActive: true,
      metadata: {},
    },
  });

  const step4 = await prisma.workflowStep.create({
    data: {
      workflowId: outboundWorkflow.id,
      stepSequence: 4,
      stepCode: 'TRANSFORM',
      stepName: 'Transform to ISO20022',
      stepDescription: 'Transform payment to ISO20022 pacs.008 format',
      stepType: 'TRANSFORMATION',
      isMandatory: true,
      isAsync: false,
      isHitlCheckpoint: false,
      onErrorAction: 'FAIL',
      maxRetries: 1,
      retryDelaySeconds: 10,
      stepConfig: {
        target_format: 'ISO20022',
        message_type: 'pacs.008.001.08',
        include_structured_remittance: true,
      },
      inputMapping: {
        payment_data: 'payload',
      },
      outputMapping: {
        iso_message: 'result.iso20022_message',
      },
      validationSchema: {},
      hitlTriggers: [],
      isActive: true,
      metadata: {},
    },
  });

  const step5 = await prisma.workflowStep.create({
    data: {
      workflowId: outboundWorkflow.id,
      stepSequence: 5,
      stepCode: 'SUBMIT',
      stepName: 'Submit to FedNow',
      stepDescription: 'Submit payment message to FedNow Service',
      stepType: 'SUBMISSION',
      isMandatory: true,
      isAsync: false,
      isHitlCheckpoint: false,
      onErrorAction: 'RETRY',
      maxRetries: 3,
      retryDelaySeconds: 60,
      stepConfig: {
        endpoint: 'credit_transfer',
        timeout_seconds: 30,
        require_acknowledgment: true,
      },
      inputMapping: {
        iso_message: 'result.iso20022_message',
      },
      outputMapping: {
        submission_response: 'result.fednow_response',
        message_id: 'result.message_id',
      },
      validationSchema: {},
      hitlTriggers: [],
      isActive: true,
      metadata: {},
    },
  });

  const step6 = await prisma.workflowStep.create({
    data: {
      workflowId: outboundWorkflow.id,
      stepSequence: 6,
      stepCode: 'ACKNOWLEDGE',
      stepName: 'Process Acknowledgment',
      stepDescription: 'Process acknowledgment from FedNow',
      stepType: 'ACKNOWLEDGMENT',
      isMandatory: true,
      isAsync: true,
      isHitlCheckpoint: false,
      onErrorAction: 'HITL',
      maxRetries: 0,
      retryDelaySeconds: 0,
      stepConfig: {
        wait_for_response: true,
        timeout_minutes: 2,
      },
      inputMapping: {
        message_id: 'result.message_id',
      },
      outputMapping: {
        acknowledgment: 'result.acknowledgment',
        status: 'result.payment_status',
      },
      validationSchema: {},
      hitlTriggers: ['TIMEOUT', 'NEGATIVE_ACK'],
      isActive: true,
      metadata: {},
    },
  });

  const step7 = await prisma.workflowStep.create({
    data: {
      workflowId: outboundWorkflow.id,
      stepSequence: 7,
      stepCode: 'NOTIFY',
      stepName: 'Send Notifications',
      stepDescription: 'Notify relevant parties of transaction status',
      stepType: 'NOTIFICATION',
      isMandatory: false,
      isAsync: true,
      isHitlCheckpoint: false,
      onErrorAction: 'SKIP',
      maxRetries: 2,
      retryDelaySeconds: 30,
      stepConfig: {
        notification_channels: ['email', 'webhook', 'sms'],
        template: 'payment_completed',
      },
      inputMapping: {
        transaction: 'payload.transaction',
        status: 'result.payment_status',
      },
      outputMapping: {
        notification_sent: 'result.notifications',
      },
      validationSchema: {},
      hitlTriggers: [],
      isActive: true,
      metadata: {},
    },
  });

  console.log(`✓ Created ${7} workflow steps`);

  // ============================================================================
  // 9. WORKFLOW STEP TRANSITIONS
  // ============================================================================
  console.log('🔄 Seeding Workflow Step Transitions...');

  await prisma.workflowStepTransition.createMany({
    data: [
      {
        workflowId: outboundWorkflow.id,
        fromStepId: null,
        toStepId: step1.id,
        transitionTrigger: 'PENDING',
        priority: 1,
        isActive: true,
      },
      {
        workflowId: outboundWorkflow.id,
        fromStepId: step1.id,
        toStepId: step2.id,
        transitionTrigger: 'SUCCESS',
        priority: 1,
        isActive: true,
      },
      {
        workflowId: outboundWorkflow.id,
        fromStepId: step2.id,
        toStepId: step3.id,
        transitionTrigger: 'SUCCESS',
        priority: 1,
        isActive: true,
      },
      {
        workflowId: outboundWorkflow.id,
        fromStepId: step3.id,
        toStepId: step4.id,
        transitionTrigger: 'SUCCESS',
        priority: 1,
        isActive: true,
      },
      {
        workflowId: outboundWorkflow.id,
        fromStepId: step4.id,
        toStepId: step5.id,
        transitionTrigger: 'SUCCESS',
        priority: 1,
        isActive: true,
      },
      {
        workflowId: outboundWorkflow.id,
        fromStepId: step5.id,
        toStepId: step6.id,
        transitionTrigger: 'SUCCESS',
        priority: 1,
        isActive: true,
      },
      {
        workflowId: outboundWorkflow.id,
        fromStepId: step6.id,
        toStepId: step7.id,
        transitionTrigger: 'SUCCESS',
        priority: 1,
        isActive: true,
      },
      {
        workflowId: outboundWorkflow.id,
        fromStepId: step7.id,
        toStepId: null,
        transitionTrigger: 'SUCCESS',
        priority: 1,
        isActive: true,
      },
    ],
  });
  console.log(`✓ Created workflow transitions`);

  // ============================================================================
  // 10. VALIDATION RULES
  // ============================================================================
  console.log('✅ Seeding Validation Rules...');

  await prisma.validationRule.createMany({
    data: [
      {
        railId: fedNow.id,
        productId: creditTransferProduct.id,
        ruleCode: 'FN-AMOUNT-LIMIT',
        ruleName: 'FedNow Amount Limit Validation',
        ruleDescription: 'Validate payment amount is within FedNow limits',
        ruleCategory: 'LIMIT',
        rulePriority: 100,
        ruleExpression: {
          field: 'instructed_amount',
          operator: 'BETWEEN',
          min: 0.01,
          max: 500000.00,
        },
        errorCode: 'AMOUNT_EXCEEDS_LIMIT',
        errorMessage: 'Payment amount must be between $0.01 and $500,000.00',
        isBlocking: true,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        railId: fedNow.id,
        productId: creditTransferProduct.id,
        ruleCode: 'FN-ACCOUNT-FORMAT',
        ruleName: 'Account Number Format Validation',
        ruleDescription: 'Validate account number format',
        ruleCategory: 'FORMAT',
        rulePriority: 90,
        ruleExpression: {
          field: 'creditor_account',
          operator: 'REGEX',
          pattern: '^[0-9]{6,17}$',
        },
        errorCode: 'INVALID_ACCOUNT_FORMAT',
        errorMessage: 'Account number must be 6-17 digits',
        isBlocking: true,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        railId: fedNow.id,
        productId: creditTransferProduct.id,
        ruleCode: 'FN-ROUTING-NUMBER',
        ruleName: 'Routing Number Validation',
        ruleDescription: 'Validate ABA routing number',
        ruleCategory: 'FORMAT',
        rulePriority: 90,
        ruleExpression: {
          field: 'creditor_routing_number',
          operator: 'REGEX',
          pattern: '^[0-9]{9}$',
        },
        errorCode: 'INVALID_ROUTING_NUMBER',
        errorMessage: 'Routing number must be 9 digits',
        isBlocking: true,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        railId: fedNow.id,
        productId: creditTransferProduct.id,
        ruleCode: 'FN-BUSINESS-HOURS',
        ruleName: 'Business Hours Check',
        ruleDescription: 'FedNow operates 24/7/365 - always passes',
        ruleCategory: 'BUSINESS',
        rulePriority: 50,
        ruleExpression: {
          always: true,
        },
        errorCode: null,
        errorMessage: null,
        isBlocking: false,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {
          note: 'FedNow is 24x7x365',
        },
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        railId: fedNow.id,
        productId: creditTransferProduct.id,
        ruleCode: 'FN-DUPLICATE-CHECK',
        ruleName: 'Duplicate Transaction Check',
        ruleDescription: 'Check for duplicate end-to-end IDs',
        ruleCategory: 'BUSINESS',
        rulePriority: 80,
        ruleExpression: {
          field: 'end_to_end_id',
          operator: 'UNIQUE',
          window_hours: 24,
        },
        errorCode: 'DUPLICATE_TRANSACTION',
        errorMessage: 'Duplicate end-to-end ID detected',
        isBlocking: true,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
    ],
  });
  console.log(`✓ Created validation rules`);

  // ============================================================================
  // 11. ROUTING RULES
  // ============================================================================
  console.log('🎯 Seeding Routing Rules...');

  await prisma.routingRule.create({
    data: {
      ruleCode: 'US-DOMESTIC-INSTANT',
      ruleName: 'US Domestic Instant Payment Routing',
      ruleDescription: 'Route US domestic instant payments to FedNow',
      rulePriority: 100,
      conditionCountryFrom: usa.id,
      conditionCountryTo: usa.id,
      conditionCurrency: usd.id,
      conditionAmountMin: 0.01,
      conditionAmountMax: 500000.00,
      conditionExpression: {
        payment_type: 'INSTANT',
        urgency: 'HIGH',
      },
      targetRailId: fedNow.id,
      targetProductId: creditTransferProduct.id,
      fallbackRailId: null,
      isActive: true,
      effectiveFrom: new Date('2023-07-20'),
      effectiveTo: null,
      metadata: {
        use_cases: ['instant_payment', 'urgent_transfer'],
      },
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });
  console.log(`✓ Created routing rules`);

  // ============================================================================
  // 12. SYSTEM CONFIGURATION
  // ============================================================================
  console.log('⚙️  Seeding System Configuration...');

  await prisma.systemConfiguration.createMany({
    data: [
      {
        configKey: 'PLATFORM_NAME',
        configValue: 'PayFlow Global Payment HUB',
        configType: 'STRING',
        category: 'GENERAL',
        description: 'Platform name',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        configKey: 'PLATFORM_VERSION',
        configValue: '1.0.0',
        configType: 'STRING',
        category: 'GENERAL',
        description: 'Platform version',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        configKey: 'FEDNOW_ENABLED',
        configValue: 'true',
        configType: 'BOOLEAN',
        category: 'PAYMENT_RAIL',
        description: 'FedNow Service enabled',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        configKey: 'MAX_TRANSACTION_AMOUNT_USD',
        configValue: '500000.00',
        configType: 'NUMBER',
        category: 'LIMITS',
        description: 'Maximum transaction amount in USD',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        configKey: 'FRAUD_DETECTION_ENABLED',
        configValue: 'true',
        configType: 'BOOLEAN',
        category: 'SECURITY',
        description: 'Enable fraud detection',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        configKey: 'HITL_AUTO_ESCALATION_MINUTES',
        configValue: '30',
        configType: 'NUMBER',
        category: 'HITL',
        description: 'Auto escalation time for HITL interventions',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        configKey: 'NOTIFICATION_EMAIL_ENABLED',
        configValue: 'true',
        configType: 'BOOLEAN',
        category: 'NOTIFICATION',
        description: 'Enable email notifications',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
      {
        configKey: 'AUDIT_LOG_RETENTION_DAYS',
        configValue: '2555',
        configType: 'NUMBER',
        category: 'COMPLIANCE',
        description: 'Audit log retention period (7 years)',
        isSensitive: false,
        isActive: true,
        metadata: {},
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM',
      },
    ],
  });
  console.log(`✓ Created system configuration`);

  // ============================================================================
  // 13. FEE CONFIGURATION
  // ============================================================================
  console.log('💰 Seeding Fee Configuration...');

  await prisma.feeConfiguration.createMany({
    data: [
      {
        railId: fedNow.id,
        productId: creditTransferProduct.id,
        feeCode: 'FN-CT-STANDARD',
        feeName: 'FedNow Credit Transfer - Standard Fee',
        feeType: 'FLAT',
        feeAmount: 0.045,
        feePercentage: null,
        minFee: null,
        maxFee: null,
        currencyId: usd.id,
        amountFrom: null,
        amountTo: null,
        tierConfig: null,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {
          note: 'Per transaction fee charged by Federal Reserve',
        },
      },
      {
        railId: fedNow.id,
        productId: requestForPaymentProduct.id,
        feeCode: 'FN-RFP-STANDARD',
        feeName: 'FedNow Request for Payment - Standard Fee',
        feeType: 'FLAT',
        feeAmount: 0.015,
        feePercentage: null,
        minFee: null,
        maxFee: null,
        currencyId: usd.id,
        amountFrom: null,
        amountTo: null,
        tierConfig: null,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {
          note: 'Per request fee',
        },
      },
      {
        railId: fedNow.id,
        productId: returnProduct.id,
        feeCode: 'FN-RETURN-STANDARD',
        feeName: 'FedNow Payment Return - Standard Fee',
        feeType: 'FLAT',
        feeAmount: 0.045,
        feePercentage: null,
        minFee: null,
        maxFee: null,
        currencyId: usd.id,
        amountFrom: null,
        amountTo: null,
        tierConfig: null,
        isActive: true,
        effectiveFrom: new Date('2023-07-20'),
        effectiveTo: null,
        metadata: {
          note: 'Per return transaction fee',
        },
      },
    ],
  });
  console.log(`✓ Created fee configuration`);

  // ============================================================================
  // 14. SAMPLE PAYMENT TRANSACTIONS
  // ============================================================================
  console.log('💳 Seeding Sample Payment Transactions...');

  const transaction1 = await prisma.paymentTransaction.create({
    data: {
      transactionRef: 'FN-20231215-0000001',
      endToEndId: 'PFGH-E2E-20231215-001',
      instructionId: 'PFGH-INSTR-20231215-001',
      uetr: '550e8400-e29b-41d4-a716-446655440001',
      railId: fedNow.id,
      productId: creditTransferProduct.id,
      workflowId: outboundWorkflow.id,
      direction: 'OUTBOUND',
      status: 'COMPLETED',
      previousStatus: 'SETTLED',
      instructedAmount: 1500.00,
      instructedCurrencyId: usd.id,
      settlementAmount: 1500.00,
      settlementCurrencyId: usd.id,
      exchangeRate: null,
      chargesAmount: 0.045,
      chargeBearer: 'SLEV',
      creationDatetime: new Date(),
      valueDate: new Date(),
      settlementDate: new Date(),
      completedDatetime: new Date(),
      purposeCode: 'SALA',
      purposeDescription: 'Salary Payment',
      remittanceInfo: 'Payroll December 2023',
      batchId: null,
      batchSequence: null,
      currentStepId: null,
      retryCount: 0,
      isSuspicious: false,
      requiresHitl: false,
      railSpecificData: {
        settlement_method: 'INDA',
        clearing_system: 'FDN',
        instruction_priority: 'HIGH',
      },
      originalMessage: {
        message_type: 'pacs.008.001.08',
        creation_date_time: new Date().toISOString(),
      },
      transformedMessage: null,
      responseMessage: {
        message_id: 'FN-ACK-20231215-001',
        status: 'ACSC',
        settlement_time: new Date().toISOString(),
      },
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      metadata: {
        processing_time_ms: 850,
        api_version: '1.0',
      },
    },
  });
  console.log(`✓ Created transaction: ${transaction1.transactionRef}`);

  const transaction2 = await prisma.paymentTransaction.create({
    data: {
      transactionRef: 'FN-20231215-0000002',
      endToEndId: 'PFGH-E2E-20231215-002',
      instructionId: 'PFGH-INSTR-20231215-002',
      uetr: '550e8400-e29b-41d4-a716-446655440002',
      railId: fedNow.id,
      productId: creditTransferProduct.id,
      workflowId: outboundWorkflow.id,
      direction: 'OUTBOUND',
      status: 'PROCESSING',
      previousStatus: 'VALIDATED',
      instructedAmount: 25000.00,
      instructedCurrencyId: usd.id,
      settlementAmount: null,
      settlementCurrencyId: null,
      exchangeRate: null,
      chargesAmount: 0.045,
      chargeBearer: 'SLEV',
      creationDatetime: new Date(),
      valueDate: new Date(),
      settlementDate: null,
      completedDatetime: null,
      purposeCode: 'SUPP',
      purposeDescription: 'Supplier Payment',
      remittanceInfo: 'Invoice INV-2023-12345',
      batchId: null,
      batchSequence: null,
      currentStepId: step5.id,
      retryCount: 0,
      isSuspicious: false,
      requiresHitl: false,
      railSpecificData: {
        settlement_method: 'INDA',
        clearing_system: 'FDN',
        instruction_priority: 'HIGH',
      },
      originalMessage: {
        message_type: 'pacs.008.001.08',
        creation_date_time: new Date().toISOString(),
      },
      transformedMessage: null,
      responseMessage: null,
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      metadata: {
        initiated_by: 'accounts_payable',
      },
    },
  });
  console.log(`✓ Created transaction: ${transaction2.transactionRef}`);

  // ============================================================================
  // 15. TRANSACTION PARTIES
  // ============================================================================
  console.log('👥 Seeding Transaction Parties...');

  await prisma.transactionParty.createMany({
    data: [
      // Transaction 1 - Debtor
      {
        transactionId: transaction1.id,
        partyType: 'DEBTOR',
        partySequence: 1,
        partyName: 'PayFlow Global Inc',
        partyAccountNumber: '1234567890',
        partyAccountType: 'CHECKING',
        partyBic: null,
        partyLei: null,
        partyRoutingNumber: '021000021',
        addressLine1: '123 Business Plaza',
        addressLine2: 'Suite 500',
        city: 'New York',
        stateProvince: 'NY',
        postalCode: '10001',
        countryId: usa.id,
        agentName: 'JPMorgan Chase Bank',
        agentBic: 'CHASUS33',
        agentRoutingNumber: '021000021',
        agentAccount: null,
        partyDetails: {
          tax_id: 'XX-XXXXXXX',
          organization_type: 'CORPORATION',
        },
        metadata: {},
      },
      // Transaction 1 - Creditor
      {
        transactionId: transaction1.id,
        partyType: 'CREDITOR',
        partySequence: 1,
        partyName: 'John Doe',
        partyAccountNumber: '9876543210',
        partyAccountType: 'SAVINGS',
        partyBic: null,
        partyLei: null,
        partyRoutingNumber: '111000025',
        addressLine1: '456 Residential St',
        addressLine2: 'Apt 12B',
        city: 'Los Angeles',
        stateProvince: 'CA',
        postalCode: '90001',
        countryId: usa.id,
        agentName: 'Bank of America',
        agentBic: 'BOFAUS3N',
        agentRoutingNumber: '111000025',
        agentAccount: null,
        partyDetails: {
          employee_id: 'EMP-2023-001',
        },
        metadata: {},
      },
      // Transaction 2 - Debtor
      {
        transactionId: transaction2.id,
        partyType: 'DEBTOR',
        partySequence: 1,
        partyName: 'PayFlow Global Inc',
        partyAccountNumber: '1234567890',
        partyAccountType: 'CHECKING',
        partyBic: null,
        partyLei: null,
        partyRoutingNumber: '021000021',
        addressLine1: '123 Business Plaza',
        addressLine2: 'Suite 500',
        city: 'New York',
        stateProvince: 'NY',
        postalCode: '10001',
        countryId: usa.id,
        agentName: 'JPMorgan Chase Bank',
        agentBic: 'CHASUS33',
        agentRoutingNumber: '021000021',
        agentAccount: null,
        partyDetails: {
          tax_id: 'XX-XXXXXXX',
        },
        metadata: {},
      },
      // Transaction 2 - Creditor
      {
        transactionId: transaction2.id,
        partyType: 'CREDITOR',
        partySequence: 1,
        partyName: 'ABC Supplies LLC',
        partyAccountNumber: '5555666677',
        partyAccountType: 'CHECKING',
        partyBic: null,
        partyLei: null,
        partyRoutingNumber: '026009593',
        addressLine1: '789 Commerce Ave',
        addressLine2: null,
        city: 'Chicago',
        stateProvince: 'IL',
        postalCode: '60601',
        countryId: usa.id,
        agentName: 'Wells Fargo Bank',
        agentBic: 'WFBIUS6S',
        agentRoutingNumber: '026009593',
        agentAccount: null,
        partyDetails: {
          vendor_id: 'VEND-2023-456',
          tax_id: 'XX-XXXXXXX',
        },
        metadata: {},
      },
    ],
  });
  console.log(`✓ Created transaction parties`);

  // ============================================================================
  // 16. PAYMENT PROCESS LOGS
  // ============================================================================
  console.log('📊 Seeding Payment Process Logs...');

  let eventSeq = 1;
  await prisma.paymentProcessLog.createMany({
    data: [
      {
        transactionId: transaction1.id,
        workflowId: outboundWorkflow.id,
        stepId: step1.id,
        eventId: `EVT-${transaction1.id}-001`,
        eventSequence: BigInt(eventSeq++),
        eventType: 'STEP_STARTED',
        eventTimestamp: new Date(Date.now() - 10000),
        executionStatus: 'IN_PROGRESS',
        previousStatus: null,
        transactionStatus: 'INITIATED',
        stepCode: 'VALIDATE',
        stepName: 'Validate Payment Request',
        durationMs: null,
        inputData: { transaction: 'data' },
        outputData: null,
        executionContext: null,
        isHitlTriggered: false,
        hitlReason: null,
        retryAttempt: 0,
        isRetry: false,
        parentLogId: null,
        correlationId: transaction1.uetr,
        traceId: `trace-${transaction1.id}`,
        spanId: 'span-001',
        processorId: 'worker-01',
        processorHost: 'app-server-01',
        message: 'Starting validation',
        details: {},
        metadata: {},
      },
      {
        transactionId: transaction1.id,
        workflowId: outboundWorkflow.id,
        stepId: step1.id,
        eventId: `EVT-${transaction1.id}-002`,
        eventSequence: BigInt(eventSeq++),
        eventType: 'STEP_COMPLETED',
        eventTimestamp: new Date(Date.now() - 9000),
        executionStatus: 'SUCCESS',
        previousStatus: 'IN_PROGRESS',
        transactionStatus: 'VALIDATED',
        stepCode: 'VALIDATE',
        stepName: 'Validate Payment Request',
        durationMs: BigInt(250),
        inputData: { transaction: 'data' },
        outputData: { validation_result: 'PASSED' },
        executionContext: null,
        isHitlTriggered: false,
        hitlReason: null,
        retryAttempt: 0,
        isRetry: false,
        parentLogId: null,
        correlationId: transaction1.uetr,
        traceId: `trace-${transaction1.id}`,
        spanId: 'span-001',
        processorId: 'worker-01',
        processorHost: 'app-server-01',
        message: 'Validation successful',
        details: { checks_passed: ['format', 'amount', 'account'] },
        metadata: {},
      },
    ],
  });
  console.log(`✓ Created payment process logs`);

  console.log('');
  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  - Countries: 1 (USA)');
  console.log('  - Currencies: 1 (USD)');
  console.log('  - Payment Rails: 1 (FedNow)');
  console.log('  - Payment Products: 3 (Credit Transfer, Request for Payment, Return)');
  console.log('  - Workflow Definitions: 1');
  console.log('  - Workflow Steps: 7');
  console.log('  - Validation Rules: 5');
  console.log('  - Routing Rules: 1');
  console.log('  - System Configuration: 8 settings');
  console.log('  - Fee Configuration: 3 fee structures');
  console.log('  - Sample Transactions: 2');
  console.log('  - Transaction Parties: 4');
  console.log('  - Process Logs: 2 entries');
  console.log('');
  console.log('🎉 PayFlow Global Payment HUB - FedNow configuration complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

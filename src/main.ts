import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Prisma shutdown hooks
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Swagger configuration
  if (process.env.SWAGGER_ENABLED !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('Payment Rails API')
      .setDescription(
        `# Multi-Payment Rail SaaS Platform API

## Overview
This API provides comprehensive support for managing multiple payment rails including FedNow, SWIFT, ACH, SEPA, and others.
It supports event streaming, workflow management, and Human-in-the-Loop (HITL) interventions for complex payment scenarios.

## Features
- **Multi-Rail Support**: Configure and manage multiple payment rails
- **Transaction Management**: Create, track, and manage payment transactions
- **Workflow Engine**: Define and execute custom payment workflows
- **Event Streaming**: Track complete transaction journey with detailed process logs
- **HITL Support**: Manage suspicious transactions requiring human intervention
- **Validation & Routing**: Flexible rule-based validation and routing
- **Audit Trail**: Complete audit history for compliance

## Authentication
Currently, the API does not require authentication. In production, implement appropriate authentication mechanisms.

## Rate Limiting
Rate limiting is not currently implemented. Consider implementing it for production use.

## Database
- PostgreSQL 15+
- Prisma ORM
- UUID-based identifiers`,
      )
      .setVersion('1.0.0')
      .setContact(
        'Payment Platform Team',
        'https://example.com',
        'support@example.com',
      )
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addTag('Countries', 'Country master data management')
      .addTag('Currencies', 'Currency master data management')
      .addTag('Payment Rails', 'Payment rail configuration and management')
      .addTag('Payment Transactions', 'Payment transaction processing and tracking')
      .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Local development')
      .addServer('https://api-staging.example.com', 'Staging environment')
      .addServer('https://api.example.com', 'Production environment')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });

    // Serve Swagger UI
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'Payment Rails API Documentation',
      customfavIcon: 'https://nestjs.com/img/logo_text.svg',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        syntaxHighlight: {
          activate: true,
          theme: 'monokai',
        },
      },
    });

    // Serve Swagger JSON
    SwaggerModule.setup('api/docs-json', app, document);

    logger.log(`📚 Swagger documentation available at http://localhost:${process.env.PORT || 3000}/api/docs`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();

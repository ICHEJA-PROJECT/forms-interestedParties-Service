import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { envs } from './config/configuration';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Usar Winston logger personalizado
  const logger = new Logger();
  app.useLogger(logger);

  // Configurar Helmet para seguridad
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Necesario para Swagger UI
          scriptSrc: ["'self'", "'unsafe-inline'"], // Necesario para Swagger UI
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      hidePoweredBy: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: envs.cors.origins,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Forms Interested Parties Service')
    .setDescription(`
## Descripción

API para la gestión de formularios de partes interesadas.

## Características

- **Autenticación JWT**: El endpoint GET /forms requiere autenticación Bearer Token
- **Rate Limiting**: Límite de ${envs.rateLimit.limit} requests por minuto
- **Validación**: Validación automática de DTOs con class-validator

## Flujo de Autenticación

1. Realizar login con username y password en \`POST /auth/login\`
2. Obtener \`access_token\`
3. Usar \`access_token\` en header \`Authorization: Bearer {token}\` para requests protegidos

## Códigos de Estado

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Datos de entrada inválidos
- **401**: No autenticado o token inválido
- **429**: Demasiadas solicitudes (rate limit excedido)
- **500**: Error interno del servidor
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido del endpoint /auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('forms', 'Gestión de formularios de contacto')
    .addTag('auth', 'Autenticación y autorización')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Establecer prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // Configurar Swagger UI para documentación de API
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Forms API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  logger.log('API documentation: Swagger UI (mounted at /api/docs)', 'Bootstrap');

  await app.listen(envs.port);

  logger.log(`HTTP server running on port ${envs.port}`, 'Bootstrap');
  logger.log(`API documentation available at http://localhost:${envs.port}/api/docs`, 'Bootstrap');
  logger.log(`Environment: ${envs.nodeEnv}`, 'Bootstrap');
  logger.log(`CORS enabled for: ${envs.cors.origins.join(', ')}`, 'Bootstrap');
  logger.log(`Rate limit: ${envs.rateLimit.limit} requests per ${envs.rateLimit.ttl / 1000} seconds`, 'Bootstrap');
  logger.log('Security headers enabled: Helmet (CSP, HSTS, X-Frame-Options)', 'Bootstrap');
}

bootstrap();
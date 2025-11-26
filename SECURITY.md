# Documentación de Seguridad

Este documento describe las medidas de seguridad implementadas en el servicio de formularios.

## Características de Seguridad Implementadas

### 1. Validación y Sanitización de Entradas

- **ValidationPipe Global**: Configurado con `whitelist: true` y `forbidNonWhitelisted: true`
  - Elimina automáticamente propiedades no definidas en los DTOs
  - Rechaza peticiones con campos adicionales no permitidos
  - Transforma los datos automáticamente según los decoradores

- **Validaciones en DTOs**:
  - `CreateFormDto`: Validación completa de todos los campos
  - `FilterFormsDto`: Validación con sanitización mediante `@Transform`
  - Uso de `class-validator` para validaciones robustas
  - Validación de emails, números de teléfono y códigos postales

### 2. Cabeceras de Seguridad (Helmet)

Configurado en [src/main.ts](src/main.ts):

- **HSTS**: Fuerza conexiones HTTPS (max-age: 1 año)
- **X-Frame-Options**: Previene clickjacking (deny)
- **hidePoweredBy**: Oculta la cabecera X-Powered-By
- **Nota**: CSP deshabilitado para compatibilidad con Scalar API Reference

### 3. Autenticación y Autorización

#### Hash de Contraseñas
- Uso de `bcrypt` con 12 rondas de salt
- Contraseñas nunca almacenadas en texto plano
- Implementado en [src/auth/auth.service.ts](src/auth/auth.service.ts)

#### JWT (JSON Web Tokens)
- Tokens firmados con secret de 32+ caracteres
- Tiempo de expiración configurable (default: 1 hora)
- Estrategia JWT implementada con Passport

#### Protección contra Fuerza Bruta
- Máximo 5 intentos fallidos de login
- Bloqueo de cuenta por 15 minutos después de 5 intentos
- Logging de todos los intentos fallidos
- Reseteo automático después del bloqueo

### 4. Rate Limiting

Configuración específica por endpoint:

| Endpoint | Límite | Tiempo |
|----------|--------|--------|
| POST /auth/login | 5 requests | 15 minutos |
| POST /forms | 10 requests | 1 hora |
| GET /forms/* | 100 requests | 1 minuto |
| Global (default) | 50 requests | 1 minuto |

### 5. Seguridad de Base de Datos

Configurado en [src/app.module.ts](src/app.module.ts):

- **Connection Pooling**: Máximo 10 conexiones simultáneas
- **Query Timeout**: 5 segundos máximo por query
- **SSL/TLS**: Habilitado en producción
- **Queries Parametrizadas**: Prevención de SQL injection mediante TypeORM

### 6. Logging

Implementado con el Logger nativo de NestJS:

- **Eventos de Seguridad Loggeados**:
  - Intentos de login fallidos
  - Cuentas bloqueadas
  - Accesos no autorizados (401/403)
  - Errores y excepciones
  - Eventos del sistema

- **Sanitización de Logs**:
  - URLs sanitizadas (tokens/passwords removidos en el filtro de excepciones)
  - No se exponen stack traces en producción

### 7. Manejo Centralizado de Errores

Filtro global en [src/common/filters/all-exceptions.filter.ts](src/common/filters/all-exceptions.filter.ts):

- Stack traces solo en desarrollo
- Mensajes de error genéricos en producción
- Logging automático de todos los errores
- Sanitización de información sensible

### 8. CORS (Cross-Origin Resource Sharing)

Configuración en [src/main.ts](src/main.ts):

- Orígenes específicos (no wildcard en producción)
- Métodos HTTP explícitos
- Headers permitidos limitados
- Credentials habilitado solo cuando sea necesario

## Configuración Inicial

### 1. Crear Usuario Administrador

Después de configurar la base de datos, ejecuta:

```bash
npm run seed:admin
```

Esto creará un usuario con:
- **Username**: `admin`
- **Password**: `Admin123!`
- **Email**: `admin@formsservice.com`

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer login.

### 2. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

Variables críticas:
- `JWT_SECRET`: Mínimo 32 caracteres, único por ambiente
- `DB_PASSWORD`: Contraseña segura para PostgreSQL
- `NODE_ENV`: `production` en producción

### 3. Base de Datos PostgreSQL

Para producción, asegúrate de:
1. Usar SSL/TLS para conexiones (automático si `NODE_ENV=production`)
2. Crear usuario de solo lectura para operaciones GET
3. Habilitar audit logging en PostgreSQL
4. Configurar backups automáticos

## Uso de la API

### 1. Obtener un token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }'
```

Respuesta:
```json
{
  "user": {
    "id": "uuid",
    "username": "admin",
    "roles": ["admin"]
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Usar el token para acceder a endpoints protegidos

```bash
curl -X GET http://localhost:3000/forms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Recomendaciones Adicionales

### Para Implementar en el Futuro

1. **Refresh Tokens**: Implementar tokens de refresco para mayor seguridad
2. **2FA**: Autenticación de dos factores
3. **Rate Limiting con Redis**: Para ambientes distribuidos
4. **Encriptación de Campos**: Para datos sensibles (email, teléfono)
5. **API Versioning**: `/api/v1/forms` para mejor mantenimiento
6. **Auditoría Completa**: Tracking de cambios en registros sensibles
7. **GDPR Compliance**: Endpoints para exportación/eliminación de datos

### Monitoreo

Implementa alertas para:
- Múltiples intentos de login fallidos
- Rate limit excedido frecuentemente
- Errores 500 (Internal Server Error)
- Queries lentas (>5 segundos)
- Patrones sospechosos de acceso

## Checklist de Seguridad para Producción

- [ ] Cambiar `JWT_SECRET` a un valor único y seguro
- [ ] Configurar `NODE_ENV=production`
- [ ] Habilitar SSL/TLS en PostgreSQL
- [ ] Configurar CORS con orígenes específicos
- [ ] Cambiar contraseña del usuario admin
- [ ] Configurar backups de base de datos
- [ ] Configurar monitoreo y alertas
- [ ] Revisar y actualizar dependencias (`npm audit`)
- [ ] Implementar HTTPS en el servidor
- [ ] Configurar firewall para limitar acceso a la BD
- [ ] Revisar logs regularmente
- [ ] Implementar rotación de logs

## Documentación API con Scalar

La documentación interactiva está disponible en `/api` e incluye:
- Autenticación Bearer integrada
- Prueba de endpoints directamente desde el navegador
- Información de rate limiting

Para usar la autenticación en Scalar:
1. Hacer login en `/auth/login`
2. Copiar el `access_token`
3. En Scalar, hacer clic en "Authorize"
4. Pegar el token
5. Probar los endpoints protegidos

## Contacto

Para reportar vulnerabilidades de seguridad, contacta al equipo de desarrollo.

## Actualizaciones

- **2025-01-25**: Implementación inicial de medidas de seguridad
  - Helmet, bcrypt, rate limiting, logging con Winston
  - Filtro global de excepciones
  - Protección contra fuerza bruta en login

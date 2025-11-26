# Forms Interested Parties Service

API para la gestión de formularios de partes interesadas con autenticación JWT y rate limiting.

## 📋 Características

- ✅ **API HTTP pura** (sin RabbitMQ)
- ✅ **Autenticación JWT** para endpoints protegidos
- ✅ **Rate Limiting** (50 peticiones por minuto)
- ✅ **Validación con Joi** para variables de entorno
- ✅ **Documentación con Scalar** (reemplazo de Swagger UI)
- ✅ **CORS configurable**
- ✅ **Soporte SQLite y PostgreSQL**

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
cp .env.example .env
```

Editar `.env` y configurar las variables necesarias (especialmente `JWT_SECRET`).

### 3. Ejecutar en desarrollo

```bash
npm run start:dev
```

### 4. Acceder a la documentación

Abrir en el navegador: `http://localhost:3000/api`

## ⚙️ Variables de Entorno

### Application

| Variable | Descripción | Default | Requerido |
|----------|-------------|---------|-----------|
| `HTTP_PORT` | Puerto del servidor HTTP | `3000` | No |
| `NODE_ENV` | Entorno de ejecución | `development` | No |
| `CORS_ORIGINS` | Orígenes permitidos (separados por coma) | `http://localhost:3000` | No |

### Database

| Variable | Descripción | Default | Requerido |
|----------|-------------|---------|-----------|
| `DB_TYPE` | Tipo de base de datos (`sqlite` o `postgres`) | - | ✅ Sí |
| `DB_NAME` | Nombre de la base de datos | - | ✅ Sí |
| `DB_PORT` | Puerto de PostgreSQL | - | Solo para PostgreSQL |
| `DB_HOST` | Host de PostgreSQL | - | Solo para PostgreSQL |
| `DB_USERNAME` | Usuario de PostgreSQL | - | Solo para PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL | - | Solo para PostgreSQL |

### JWT

| Variable | Descripción | Default | Requerido |
|----------|-------------|---------|-----------|
| `JWT_SECRET` | Secreto para firmar tokens (mín. 32 caracteres) | - | ✅ Sí |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `1h` | No |

### Rate Limiting

| Variable | Descripción | Default | Requerido |
|----------|-------------|---------|-----------|
| `RATE_LIMIT_TTL` | Ventana de tiempo en milisegundos | `60000` | No |
| `RATE_LIMIT_MAX` | Número máximo de peticiones | `50` | No |

## 📡 Endpoints

### Authentication

#### POST /auth/login
Iniciar sesión y obtener token JWT.

**Body:**
```json
{
  "username": "admin",
  "password": "secret"
}
```

**Respuesta:**
```json
{
  "user": {
    "id": "1",
    "username": "admin",
    "roles": ["admin"]
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Forms

#### POST /forms
Crear un nuevo formulario (público, no requiere autenticación).

**Body:**
```json
{
  "nombre": "Victor",
  "apellidos": "Perez Constantino",
  "numeroTelefono": "9637894562",
  "email": "villalobos@gmail.com",
  "calle": "Septima Oriente",
  "numeroExterior": "0",
  "codigoPostal": "30040",
  "colonia": "Centro",
  "municipio": "Tuxtla Gutierrez",
  "estado": "Chiapas",
  "porQueMeInteresa": "Hola estoy interesado..."
}
```

#### GET /forms
Obtener todos los formularios (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

## 🔐 Autenticación

### Credenciales por defecto (desarrollo)

⚠️ **Solo para desarrollo/testing**:
- Username: `admin`
- Password: `secret`

### Flujo de autenticación

1. Hacer login en `POST /auth/login` con username y password
2. Obtener el `access_token` de la respuesta
3. Usar el token en el header `Authorization: Bearer {token}` para endpoints protegidos

### Ejemplo con curl

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secret"}'

# 2. Usar el token
curl -X GET http://localhost:3000/forms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📚 Documentación

La documentación interactiva con Scalar está disponible en:

```
http://localhost:3000/api
```

Características de la documentación:
- Interfaz moderna e intuitiva
- Autenticación Bearer integrada
- Prueba de endpoints directamente
- Esquemas de validación
- Códigos de respuesta

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── configuration.ts       # Configuración centralizada de env vars
├── auth/
│   ├── guards/
│   │   └── jwt-auth.guard.ts  # Guard de autenticación
│   ├── strategies/
│   │   └── jwt.strategy.ts    # Estrategia JWT
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── forms/
│   ├── controllers/
│   ├── services/
│   ├── data/
│   └── domain/
├── app.module.ts              # Módulo principal con ThrottlerModule
└── main.ts                    # Bootstrap con CORS y Scalar
```

## 🛠️ Scripts

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test

# Linting
npm run lint
```

## 🔒 Seguridad

### Generación de JWT_SECRET

Para producción, generar un secreto seguro:

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Rate Limiting

Todas las rutas están protegidas por rate limiting:
- **Límite**: 50 peticiones
- **Ventana**: 60 segundos (1 minuto)
- **Respuesta**: HTTP 429 cuando se excede

### CORS

CORS está habilitado y configurable mediante `CORS_ORIGINS`:

```bash
# Un solo origen
CORS_ORIGINS=http://localhost:3000

# Múltiples orígenes
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://mi-app.com
```

## 📦 Tecnologías

- **NestJS** - Framework backend
- **TypeORM** - ORM para base de datos
- **Passport JWT** - Autenticación
- **Joi** - Validación de env vars
- **@nestjs/throttler** - Rate limiting
- **@scalar/nestjs-api-reference** - Documentación API
- **SQLite** / **PostgreSQL** - Base de datos

## 📄 Licencia

MIT

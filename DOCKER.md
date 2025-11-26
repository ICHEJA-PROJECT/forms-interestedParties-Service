# Guía de Despliegue con Docker

Esta guía te ayudará a desplegar la API de Formularios usando Docker y Docker Compose.

## Requisitos Previos

- Docker 20.10 o superior
- Docker Compose 2.0 o superior

## Arquitectura

El `docker-compose.yml` configura dos servicios:

1. **postgres**: Base de datos PostgreSQL 16
2. **api**: API de NestJS en modo producción

## Configuración Rápida

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y edita los valores:

```bash
cp .env.docker .env
```

**IMPORTANTE**: Cambia los siguientes valores en `.env`:

- `DB_PASSWORD`: Contraseña segura para PostgreSQL
- `JWT_SECRET`: Secret único de 32+ caracteres para JWT

### 2. Construir y Levantar los Servicios

```bash
# Construir las imágenes
docker-compose build

# Levantar los servicios
docker-compose up -d
```

### 3. Verificar que los Servicios Estén Corriendo

```bash
docker-compose ps
```

Deberías ver:
```
NAME            IMAGE                  STATUS         PORTS
forms-postgres  postgres:16-alpine     Up (healthy)   0.0.0.0:5432->5432/tcp
forms-api       forms-api              Up             0.0.0.0:3000->3000/tcp
```

### 4. Crear Usuario Administrador

Una vez que los servicios estén corriendo, crea el usuario admin:

```bash
docker-compose exec api node dist/scripts/seed-admin-user.js
```

Esto creará:
- **Username**: `admin`
- **Password**: `Admin123!`
- **Email**: `admin@formsservice.com`

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer login.

## Comandos Útiles

### Ver Logs

```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs solo de la API
docker-compose logs -f api

# Logs solo de PostgreSQL
docker-compose logs -f postgres
```

### Detener los Servicios

```bash
# Detener sin eliminar contenedores
docker-compose stop

# Detener y eliminar contenedores (mantiene los datos en ./postgres-data)
docker-compose down

# Eliminar TODO incluyendo datos de la BD (CUIDADO: destructivo)
docker-compose down && rm -rf postgres-data
```

### Reiniciar los Servicios

```bash
# Reiniciar todos los servicios
docker-compose restart

# Reiniciar solo la API
docker-compose restart api
```

### Acceder a la Base de Datos

```bash
# Conectar a PostgreSQL con psql
docker-compose exec postgres psql -U postgres -d formsdb
```

### Ejecutar Comandos en el Contenedor de la API

```bash
# Abrir shell en el contenedor
docker-compose exec api sh

# Ejecutar un comando específico
docker-compose exec api node dist/scripts/seed-admin-user.js
```

## Acceder a la API

Una vez que los servicios estén corriendo:

- **API**: http://localhost:3000
- **Documentación (Scalar)**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432

## Estructura de Docker Compose

```yaml
services:
  postgres:
    - Image: postgres:16-alpine
    - Puerto: 5432
    - Volumen: ./postgres-data (persistente, local al proyecto)
    - Healthcheck: Verifica que PostgreSQL esté listo

  api:
    - Build: Usa dockerfile.prod (multi-stage)
    - Puerto: 3000
    - Depends on: postgres (espera a que esté healthy)
    - Volumen: ./logs (logs de la aplicación)
```

## Variables de Entorno

El archivo `.env` controla la configuración:

```env
# Application
HTTP_PORT=3000
NODE_ENV=production
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Database
DB_NAME=formsdb
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-32-chars-or-more
JWT_EXPIRES_IN=1h

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=50
```

## Multi-Stage Build (dockerfile.prod)

El Dockerfile usa un build de múltiples etapas para optimizar el tamaño:

1. **deps**: Instala dependencias
2. **build**: Compila TypeScript a JavaScript
3. **prod**: Imagen final con solo lo necesario (~150MB)

## Persistencia de Datos

- **Base de Datos**: Los datos se almacenan en el directorio local `./postgres-data` del proyecto
- **Logs**: Los logs se mapean a `./logs` en el host

**Nota**: El directorio `postgres-data/` está excluido en `.gitignore` para no versionar los datos de la base de datos.

Para hacer backup de la base de datos:

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres formsdb > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres formsdb < backup.sql
```

## Troubleshooting

### La API no se conecta a PostgreSQL

Verifica que PostgreSQL esté healthy:

```bash
docker-compose ps postgres
```

Si no está healthy, revisa los logs:

```bash
docker-compose logs postgres
```

### Error "JWT_SECRET is required"

Asegúrate de que el archivo `.env` existe y tiene un `JWT_SECRET` configurado.

### Puerto 3000 o 5432 ya en uso

Cambia el puerto en `.env`:

```env
HTTP_PORT=3001
DB_PORT=5433
```

Luego reinicia:

```bash
docker-compose down
docker-compose up -d
```

## Producción

Para desplegar en producción:

1. ✅ Cambia `DB_PASSWORD` a una contraseña segura
2. ✅ Genera un `JWT_SECRET` único (mínimo 32 caracteres)
3. ✅ Configura `CORS_ORIGINS` con los dominios permitidos
4. ✅ Cambia la contraseña del usuario admin después del primer login
5. ✅ Habilita HTTPS en el servidor (nginx/traefik)
6. ✅ Configura backups automáticos de PostgreSQL
7. ✅ Configura monitoreo y alertas

## Seguridad

Las siguientes medidas de seguridad están implementadas:

- ✅ Helmet (HSTS, X-Frame-Options)
- ✅ Rate Limiting (configurable por endpoint)
- ✅ JWT Authentication con bcrypt
- ✅ Validación de entradas con class-validator
- ✅ Protección contra fuerza bruta (5 intentos, bloqueo 15 min)
- ✅ Logging de eventos de seguridad
- ✅ Sanitización de errores en producción

Para más detalles, consulta [SECURITY.md](SECURITY.md).

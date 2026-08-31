# FarmixPro API

Backend REST en Laravel 13 con MariaDB/MySQL y autenticación Sanctum. El dominio cubre empresas, productos/variantes, facturación, impuestos y pagos.

## Requisitos

- PHP 8.3+
- Composer 2
- MariaDB 10.11+ / MySQL 8+ (o Docker)

## Instalación

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edita `.env` con tu base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=farmixpro
DB_USERNAME=farmixpro
DB_PASSWORD=farmixpro
```

Para MariaDB puedes usar `DB_CONNECTION=mariadb`.

### Base de datos con Docker

```bash
docker compose up -d
php artisan migrate --seed
```

### Base de datos local

Crea la base `farmixpro` y luego:

```bash
php artisan migrate --seed
php artisan serve
```

API: `http://localhost:8000/api`

## Usuario de prueba (seeder)

- Email: `admin@farmixpro.test`
- Password: `password`
- Empresa: FarmixPro SAS (vinculada en `users_companies`)

## Autenticación

La API usa **Laravel Sanctum** (Bearer token).

```bash
# Registro
curl -X POST http://localhost:8000/api/auth/register \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@farmixpro.test","password":"password123","password_confirmation":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@farmixpro.test","password":"password"}'

# Perfil
curl http://localhost:8000/api/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer TOKEN"
```

## Multi-empresa

Casi todas las tablas llevan `companies_id`. Los recursos se filtran por la **empresa actual** del usuario autenticado (membresía en `users_companies`).

Orden de resolución de la empresa actual:

1. Cabecera `X-Company-Id` (debe ser una empresa a la que el usuario pertenezca).
2. Empresa seleccionada con `POST /api/companies/{id}/switch`.
3. Primera empresa vinculada al usuario.

Si el usuario no tiene empresa, las rutas de negocio responden `422`. Crea una con `POST /api/companies` (el creador queda vinculado y esa empresa pasa a ser la actual).

## Envelope JSON

Todas las respuestas de `/api/*` usan:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "errors": null
}
```

Los listados paginados incluyen `meta` (`current_page`, `last_page`, `per_page`, `total`).

## Endpoints

Prefijo: `/api`

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/health` | No | Estado del servicio |
| POST | `/auth/register` | No | Registro |
| POST | `/auth/login` | No | Login (devuelve token) |
| POST | `/auth/logout` | Sí | Revoca el token actual |
| GET | `/auth/me` | Sí | Usuario, empresas y `current_company_id` |
| GET/POST | `/companies` | Sí | Listar / crear empresas |
| GET/PUT/DELETE | `/companies/{company}` | Sí | Ver / actualizar / eliminar |
| GET | `/companies/current` | Sí | Empresa actual |
| POST | `/companies/{company}/switch` | Sí | Seleccionar empresa actual |
| POST | `/companies/{company}/users` | Sí | Vincular usuario (`users_id` o `email`) |
| DELETE | `/companies/{company}/users/{user}` | Sí | Desvincular usuario |
| GET/POST | `/taxes` | Sí + empresa | Impuestos |
| GET/PUT/DELETE | `/taxes/{tax}` | Sí + empresa | Impuesto |
| GET/POST | `/products` | Sí + empresa | Productos |
| GET/PUT/DELETE | `/products/{product}` | Sí + empresa | Producto |
| GET/POST | `/variants-products` | Sí + empresa | Variantes (acepta `attributes[]`) |
| GET/PUT/DELETE | `/variants-products/{variant}` | Sí + empresa | Variante |
| GET/POST | `/variant-attributes` | Sí + empresa | Atributos de variante |
| GET/PUT/DELETE | `/variant-attributes/{attribute}` | Sí + empresa | Atributo |
| GET/POST | `/channels` | Sí + empresa | Canales de venta |
| GET/PUT/DELETE | `/channels/{channel}` | Sí + empresa | Canal |
| GET/POST | `/variant-channels` | Sí + empresa | Precio/stock por canal |
| GET/PUT/DELETE | `/variant-channels/{variantChannel}` | Sí + empresa | Precio de canal |
| GET/POST | `/invoices` | Sí + empresa | Facturas (líneas, impuestos y pagos anidados) |
| GET/PUT/DELETE | `/invoices/{invoice}` | Sí + empresa | Factura |
| GET/POST | `/invoice-products` | Sí + empresa | Líneas (`invoces_products`) |
| GET/PUT/DELETE | `/invoice-products/{invoiceProduct}` | Sí + empresa | Línea |
| GET/POST | `/invoice-taxes` | Sí + empresa | Impuestos de factura (`invoces_taxes`) |
| GET/PUT/DELETE | `/invoice-taxes/{invoiceTax}` | Sí + empresa | Impuesto de factura |
| GET/POST | `/methods-payments` | Sí + empresa | Métodos de pago |
| GET/PUT/DELETE | `/methods-payments/{methodPayment}` | Sí + empresa | Método |
| GET/POST | `/how-paid` | Sí + empresa | Pagos de factura |
| GET/PUT/DELETE | `/how-paid/{howPaid}` | Sí + empresa | Pago |

### Crear factura anidada

`POST /api/invoices` acepta `products`, `taxes` y `payments` en el mismo request. Si no envías `subtotal`/`total`, se calculan: subtotal = Σ(cantidad × precio − descuento); total = subtotal + impuestos (`tasa` % sobre el subtotal).

## Tablas

`users`, `companies`, `users_companies`, `taxes`, `products`, `variants_products`, `variants_products_attributes`, `channels`, `variants_products_channels`, `invoices`, `invoces_products`, `invoces_taxes`, `methods_payments`, `how_paid`.

`users` conserva el esquema Laravel (email único, `remember_token`, timestamps). El resto usa `unsignedBigInteger` + timestamps e índices/FK.

## Desviaciones respecto al diagrama

1. `variants_products` no tenía `products_id`; se añadió FK a `products.id`.
2. Se conservan las faltas de ortografía del diagrama en **tablas/columnas**: `invoces_products`, `invoces_taxes`, `is_avaliable`. Las rutas REST usan inglés correcto (`/invoices`, `/invoice-products`, `/invoice-taxes`). El API también expone `is_available` como alias.
3. `invoices.status`: `open`, `closed`, `cancelled` (por defecto `open`).
4. IDs `unsignedBigInteger` y `timestamps` en todas las tablas (el diagrama no los detallaba).

## CORS / SPA

Orígenes permitidos por defecto: `localhost:3000`, `localhost:5173`, `localhost:8080`. Ajústalos con `CORS_ALLOWED_ORIGINS` y `SANCTUM_STATEFUL_DOMAINS`.

## Tests

Los tests usan SQLite en memoria (`phpunit.xml`).

```bash
php artisan test
```

## Estilo de modelos

Clases en PascalCase alineadas a las tablas (`Companies`, `VariantsProducts`, `InvocesProducts`, `HowPaid`), FKs explícitas (`users_id`, `companies_id`, `facturas_id`) y relaciones BelongsTo / HasMany / BelongsToMany con esas claves.

# FarmixPro — Frontend

SPA de facturación en React (Vite + TypeScript) que consume la API Laravel de FarmixPro.

## Requisitos

- Node.js 20+
- API backend en `http://localhost:8000` (ver `../backend/README.md`)

## Arranque

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

El front queda en [http://localhost:5173](http://localhost:5173).

### Backend

```bash
cd ../backend
composer install
cp .env.example .env
php artisan key:generate
# configura MySQL/MariaDB y luego:
php artisan migrate --seed
php artisan serve
```

Usuario de prueba: `admin@farmixpro.test` / `password`

## Variables

| Variable | Valor por defecto |
| --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api` |

El cliente envía `Authorization: Bearer {token}` y `X-Company-Id`. Token y empresa se guardan en `localStorage`. Un 401 cierra sesión; un 422 sin empresa te lleva a crear/seleccionar empresa.

El SPA usa tokens (no cookies de sesión). `localhost:5173` debe estar en `CORS_ALLOWED_ORIGINS` y **no** en `SANCTUM_STATEFUL_DOMAINS`, para evitar el error CSRF del navegador.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/login` `/register` | Auth |
| `/select-company` | Crear o elegir empresa |
| `/` | Inicio |
| `/invoices` `/invoices/new` `/invoices/:id` | Facturas |
| `/customers` | Clientes |
| `/products` `/products/:id` | Productos y variantes |
| `/taxes` | Impuestos |
| `/methods-payments` | Métodos de pago |
| `/accounts` | Cuentas y movimientos |
| `/channels` | Canales |
| `/catalog/currencies` | Monedas e historial de tasas |
| `/companies` | Empresas |

Si la API no está disponible, las pantallas muestran un error claro (no una página en blanco).

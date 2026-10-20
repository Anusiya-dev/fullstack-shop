# FLORA — Fullstack E‑commerce

React storefront + Django REST API + SQLite.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, React Router |
| Backend  | Django 5, Django REST Framework |
| Database | SQLite (`backend/db.sqlite3`) |

## Quick start

### 1. Backend (API + database)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
python manage.py createsuperuser
python manage.py runserver 8001
```

API: `http://127.0.0.1:8001/api/`  
Admin: `http://127.0.0.1:8001/admin/`  

Use port `8001` if something else is already on `8000`.

### 2. Frontend

From the project root:

```bash
npm install
npm start
```

App: `http://localhost:3000`

Optional: create `.env` with `REACT_APP_API_URL=http://127.0.0.1:8001/api`.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products/` | List products (`?category=summer`, `?ordering=price`) |
| GET | `/api/products/<id>/` | Product detail |
| POST | `/api/orders/` | Place order (persists to SQLite, updates stock) |
| GET | `/api/orders/<order_number>/` | Order receipt |
| POST | `/api/newsletter/` | Newsletter signup |

## Customer login & register

- **Register:** [http://localhost:3000/register](http://localhost:3000/register) or navbar **Register**
- **Login:** [http://localhost:3000/login](http://localhost:3000/login) or navbar **Login**
- **Checkout requires login** — guests can browse and add to cart; placing an order needs a signed-in customer account.

Auth API: `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/logout/` (token), `GET /api/auth/me/`

## Flow

1. **Shop** loads products from the API.
2. **Cart** stays in the browser; each line includes `product_id` for checkout.
3. **Checkout** (logged in only) POSTs customer details and line items; Django creates `Order` + `OrderItem` rows and decrements stock.

## Product images

Place images under `public/image/` (paths match the seeded catalog, e.g. `/image/coord.jpeg`).

# 🎓 Campus Marketplace

> **A peer-to-peer marketplace for college students to buy and sell second-hand products**

Campus Marketplace makes it easy for students to list, discover, and trade used textbooks, laptops, gadgets, bicycles, hostel essentials, and more — all within their campus community.

[![Frontend - Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://student-marketplace-meghasyam.netlify.app)
[![Backend - Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://student-marketplace-backend-3qqs.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.2-green?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)

---

## 📸 Screenshots

> _Add screenshots of your app here (Landing Page, Product Listing, Product Detail, Login, etc.)_

| Landing Page | Product Listing | Product Details |
|---|---|---|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## ✨ Features

### 🛒 Marketplace
- Browse all active student listings with real product photos
- Filter by **category**, **condition**, **price range**, and **search term**
- Product cards with seller info, price, and condition badge
- Full product detail page with contact seller button

### 🔐 Auth & Accounts
- Register with full name, college name, email, and phone
- Login using **email or username** (case-insensitive)
- JWT access + refresh token authentication
- Protected routes for authenticated users

### ❤️ Wishlist
- Save/unsave any listing with a single click
- Wishlist persists across sessions

### 📦 Product Management
- Add new listings with title, description, category, price, and condition
- Upload product images
- Edit or delete your own listings
- "My Listings" page filtered per logged-in seller

### 👤 Profile
- View and edit your student profile (full name, college, phone)
- See your active listings and wishlisted products

### 🛡️ Admin Dashboard
- Admin-only view for managing all users and listings
- Report / flag spam products

### 🌙 Dark Mode
- Toggle between light and dark themes across the entire app

---

## 🏗️ Tech Stack

### Frontend

| Tech | Version | Purpose |
|---|---|---|
| [React](https://reactjs.org) | 19 | UI Framework |
| [Vite](https://vitejs.dev) | 8 | Build Tool & Dev Server |
| [React Router DOM](https://reactrouter.com) | 7 | Client-side Routing |
| [Bootstrap](https://getbootstrap.com) | 5.3 | CSS Framework |
| [Bootstrap Icons](https://icons.getbootstrap.com) | 1.13 | Icon Library |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | 11 | Toast Notifications |

### Backend

| Tech | Version | Purpose |
|---|---|---|
| [Django](https://djangoproject.com) | 5.2 | Web Framework |
| [Django REST Framework](https://www.django-rest-framework.org) | 3.17 | REST API |
| [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io) | 5.5 | JWT Auth |
| [django-cors-headers](https://github.com/adamchainz/django-cors-headers) | 4.9 | CORS Support |
| [WhiteNoise](https://whitenoise.readthedocs.io) | 6.8 | Static File Serving |
| [Pillow](https://pillow.readthedocs.io) | 11.3 | Image Handling |
| [Python-dotenv](https://github.com/theskumar/python-dotenv) | 1.2 | Environment Variables |
| [Gunicorn](https://gunicorn.org) | 26 | Production WSGI Server |

### Database
- **SQLite** (development default)
- **MySQL** (production-ready via PyMySQL, configure via `.env`)

---

## 📁 Folder Structure

```
Student Marketplace/
├── backend/                    # Django REST API
│   ├── accounts/               # User auth, registration, profiles
│   │   ├── backends.py         # Email or username authentication
│   │   ├── models.py           # StudentProfile model
│   │   ├── serializers.py      # Register & profile serializers
│   │   ├── views.py            # Auth views (register, profile)
│   │   └── urls.py
│   ├── marketplace/            # Core marketplace logic
│   │   ├── models.py           # Product, Category, WishlistItem, ProductImage
│   │   ├── serializers.py
│   │   ├── views.py            # Products, Categories, Wishlist ViewSets
│   │   └── urls.py
│   ├── config/                 # Django project settings & URLs
│   │   ├── settings.py
│   │   └── urls.py
│   ├── media/                  # Uploaded product images (gitignored)
│   ├── staticfiles/            # Collected static files
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── campus-marketplace/         # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Fetch wrapper with JWT refresh logic
│   │   ├── components/         # Navbar, Footer, ProductCard, etc.
│   │   ├── context/
│   │   │   └── MarketplaceContext.jsx  # Global state (auth, products, wishlist)
│   │   ├── pages/              # All route-level pages
│   │   ├── data/
│   │   │   └── mockData.js     # Category icon mappings
│   │   └── styles/             # Custom CSS variables & theme
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env                    # VITE_API_URL
│
├── .venv/                      # Python virtual environment (gitignored)
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Python** 3.11+
- **Node.js** 18+ and **npm**
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/Meghasyam99/student-marketplace.git
cd student-marketplace
```

---

### 2. Backend Setup (Django)

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Copy environment file and configure
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your settings:

```env
DJANGO_DEBUG=1
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# CORS — React dev server
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Database (leave as sqlite for local dev)
DB_ENGINE=sqlite

# JWT
JWT_ACCESS_MINUTES=60
JWT_REFRESH_DAYS=7
```

```bash
# Run migrations
python backend/manage.py migrate

# (Optional) Seed categories
python backend/manage.py seed_categories

# Start the dev server
python backend/manage.py runserver
```

Backend runs at: **http://127.0.0.1:8000**

---

### 3. Frontend Setup (React + Vite)

```bash
cd campus-marketplace

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://127.0.0.1:8000" > .env

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### 4. Create a Superuser (Optional)

```bash
python backend/manage.py createsuperuser
```

Access Django Admin at: **http://127.0.0.1:8000/admin**

---

## 🌐 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `DJANGO_DEBUG` | `1` | Enable debug mode (`1` = on, `0` = off) |
| `DJANGO_SECRET_KEY` | _(required)_ | Django secret key |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated allowed hosts |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Allowed CORS origins |
| `DB_ENGINE` | `sqlite` | `sqlite` or `mysql` |
| `MYSQL_HOST` | `127.0.0.1` | MySQL host (if DB_ENGINE=mysql) |
| `MYSQL_PORT` | `3306` | MySQL port |
| `MYSQL_DATABASE` | `campus_marketplace` | MySQL database name |
| `MYSQL_USER` | `root` | MySQL user |
| `MYSQL_PASSWORD` | _(empty)_ | MySQL password |
| `JWT_ACCESS_MINUTES` | `60` | Access token lifetime in minutes |
| `JWT_REFRESH_DAYS` | `7` | Refresh token lifetime in days |

### Frontend (`campus-marketplace/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:8000` | Django backend API base URL |

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register/` | ❌ | Register a new student account |
| `POST` | `/api/auth/token/` | ❌ | Login (email or username) → JWT tokens |
| `POST` | `/api/auth/token/refresh/` | ❌ | Refresh access token |
| `GET` | `/api/auth/profile/` | ✅ | Get current user profile |
| `PATCH` | `/api/auth/profile/` | ✅ | Update profile (name, college, phone) |

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories/` | ❌ | List all active categories |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products/` | ❌ | List all active products (filterable) |
| `POST` | `/api/products/` | ✅ | Create a new listing |
| `GET` | `/api/products/{id}/` | ❌ | Get single product detail |
| `PATCH` | `/api/products/{id}/` | ✅ (seller) | Update your listing |
| `DELETE` | `/api/products/{id}/` | ✅ (seller) | Delete your listing |
| `POST` | `/api/products/{id}/upload-image/` | ✅ (seller) | Upload image for a product |

#### Product Query Parameters

| Param | Example | Description |
|---|---|---|
| `q` | `?q=laptop` | Search by title, description, or category |
| `category` | `?category=laptops` | Filter by category slug |
| `condition` | `?condition=Like+New` | Filter by condition |
| `min_price` | `?min_price=500` | Minimum price filter |
| `max_price` | `?max_price=20000` | Maximum price filter |
| `mine` | `?mine=1` | Only show listings by current user |
| `ordering` | `?ordering=price_asc` | Sort: `price_asc`, `price_desc`, `oldest`, `latest` |
| `paginate` | `?paginate=1&page=1` | Enable pagination (12 per page) |

### Wishlist

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/wishlist/` | ✅ | Get current user's wishlist |
| `POST` | `/api/wishlist/toggle/` | ✅ | Toggle save/unsave a product |

---

## 🔑 Demo Credentials

> ⚠️ For local development and demo purposes only.

| Role | Username | Email | Password |
|---|---|---|---|
| **Admin** | `Meghasyam99` | `uppumeghasyam16@gmail.com` | `Itachi123@` |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/YourFeatureName`
3. **Commit** your changes: `git commit -m 'feat: Add YourFeatureName'`
4. **Push** to the branch: `git push origin feature/YourFeatureName`
5. **Open a Pull Request**

Please follow the existing code style and add descriptive commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Uppu Meghasyam**

- GitHub: [@Meghasyam99](https://github.com/Meghasyam99)

---

<div align="center">
  <sub>Built with ❤️ for college students everywhere 🎓</sub>
</div>


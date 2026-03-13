# Nest Coffee UI

A React-based frontend for managing a coffee shop — coffees, users, and authentication — built against a NestJS REST API backend.

---

## Features

### Authentication
- **JWT (Bearer token)** — email/password login with automatic token refresh
- **Session-based** — cookie-backed session authentication
- **API Key** — static key for programmatic access
- **Google OAuth** — sign in with Google
- **Two-Factor Authentication (2FA)** — TOTP setup and verification

### Coffee Management (`/coffees`)
- List coffees with pagination (limit/offset)
- Search by ID
- Create, edit, and delete coffees (name, brand, flavors)
- Display flavors as chips, show recommendation count

### User Management (`/users`)
- List all users
- Search by ID
- Create, edit, and delete users
- Display role (Admin/User) and 2FA status

### Settings (`/settings`)
- Generate 2FA QR code for TOTP setup
- Check active session
- View current access token, refresh token, and API key

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| UI Library | Material UI (MUI) v7 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Auth | @react-oauth/google, JWT, Sessions, API Keys |
| Styling | Emotion (CSS-in-JS) |
| Build | Create React App |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running [NestJS backend](http://localhost:3000) (or configure `REACT_APP_API_URL`)

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file (optional — defaults shown below):

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

### Run

```bash
npm start        # Development server at http://localhost:3000
npm run build    # Production build to /build
npm test         # Run tests in watch mode
```

---

## Project Structure

```
src/
├── api/
│   ├── client.js          # Axios instance with auth interceptors & token refresh
│   ├── auth.js            # Authentication endpoints
│   ├── coffees.js         # Coffee CRUD endpoints
│   └── users.js           # User CRUD endpoints
├── components/
│   ├── Layout.js          # App shell with nav bar
│   └── ProtectedRoute.js  # Auth guard for protected routes
├── context/
│   └── AuthContext.js     # Global auth state (user, mode, login/logout)
├── pages/
│   ├── LoginPage.js       # Login — JWT / Session / API Key tabs + Google OAuth
│   ├── RegisterPage.js    # Registration with auto-login
│   ├── CoffeesPage.js     # Coffee management UI
│   ├── UsersPage.js       # User management UI
│   └── SettingsPage.js    # 2FA setup, session check, token display
└── App.js                 # Root with route definitions
```

---

## API Reference

Backend base URL: `REACT_APP_API_URL` (default `http://localhost:3000`)

| Resource | Endpoints |
|---|---|
| Auth | `POST /authentication/sign-up`, `POST /authentication/sign-in`, `POST /authentication/refresh-tokens`, `POST /authentication/google`, `POST /authentication/2fa/generate` |
| Session Auth | `POST /session-authentication/sign-in`, `GET /session-authentication` |
| Coffees | `GET/POST /coffeesss`, `GET/PATCH/DELETE /coffeesss/:id` |
| Users | `GET/POST /userssxx`, `GET/PATCH/DELETE /userssxx/:id` |

---

## Auth Storage

| Item | Storage Key |
|---|---|
| Access Token | `localStorage.accessToken` |
| Refresh Token | `localStorage.refreshToken` |
| API Key | `localStorage.apiKey` |
| User Info | `localStorage.user` |

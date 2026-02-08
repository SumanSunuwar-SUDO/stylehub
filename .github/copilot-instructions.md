# StyleHub - AI Coding Agent Instructions

## Architecture Overview

StyleHub is a full-stack fitness e-commerce application with clear separation:
- **Frontend**: Next.js 16 (React 19) in `client/` → runs on `localhost:3000`
- **Backend**: Express.js in `server/` → runs on `localhost:9000`
- **Database**: MongoDB with Mongoose schemas

**Critical Data Flow**: Frontend → Axios calls → `http://localhost:9000/api/*` → Backend controllers → Mongoose models → MongoDB

## Essential Patterns

### Authentication & Authorization (2-Middleware Pattern)
All protected routes use **both** middlewares in order:

```javascript
router.patch("/update/:id", isAuthenticated, isAuthorization(["admin"]), updateUser);
```

1. **`isAuthenticated`** ([server/middleware/isAuthenticated.js](server/middleware/isAuthenticated.js)): Extracts JWT from `Authorization: Bearer <token>` header, verifies with `secretKey`, attaches `req.user._id`
2. **`isAuthorization(roles)`** ([server/middleware/isAuthorization.js](server/middleware/isAuthorization.js)): Checks `req.user._id` against MongoDB user document, validates role (["customer"] or ["admin"])

**Note**: Only admin-only actions (product CRUD, user management) use auth. Public product listing is unprotected.

### API Response Format
All controllers return consistent JSON:
```javascript
{ success: true, message: "...", result: data }  // 200-201
{ success: false, message: "error details", error: errorMsg }  // 400+
```

### State Management

**Frontend only** (Next.js):
- **[AuthContext](client/src/context/AuthContext.jsx)**: Manages `user`, `isLoggedIn`, `login()`, `logout()`. Persists via localStorage (`accessToken`, `user` keys).
- **[CartContext](client/src/context/CartContext.jsx)**: Manages shopping cart array. Persists via localStorage. Validates stock before adding.

**Note**: Both contexts read/write localStorage on mount and on state changes. No backend cart persistence.

### Data Models

**User** ([server/schema/user.model.js](server/schema/user.model.js)):
- Fields: `firstName`, `lastName`, `email`, `password` (bcrypt hashed), `address`, `role` (enum: "customer"/"admin"), `isVerifiedEmail` (boolean)
- Unique constraint on `email`
- Timestamps auto-added

**Product** ([server/schema/product.model.js](server/schema/product.model.js)):
- Fields: `productName`, `mainCategory`, `gender` (enum: "Men"/"Women"), `subCategory`, `sizes` (array of `{size, quantity, price}`), `image`, `description`
- **Important**: Sizes are stored as array objects with individual pricing and inventory per size (not a single price)

**Order** ([server/schema/order.models.js](server/schema/order.models.js)): Check file for structure — used for checkout flow.

## File Organization Rules

**Backend** (`server/`):
- `routes/*` → Express routers, mount in app.js
- `controller/*` → Logic for each route (CRUD, auth, validation)
- `schema/*` → Mongoose models (user, product, order)
- `middleware/*` → Auth, authorization, error handling
- `utils/*` → Helper functions (sendEmail, constants, sendFile)

**Frontend** (`client/src/`):
- `app/` → Next.js App Router (layouts, pages, dynamic routes)
- `context/` → React Context providers (Auth, Cart)
- `layouts/` → Shared components (Navbar, Footer)
- `components/` → Reusable page components (Product, Hero, etc.)
- `UI/` → Icon/input components
- `config/env.js` → Single API base URL (`http://localhost:9000/api`)

## Development Workflow

**Backend**:
```bash
cd server
npm install
npm run dev  # Uses nodemon for hot reload (bin/www entry point)
```

**Frontend**:
```bash
cd client
npm install
npm run dev  # Next.js dev server with HMR
npm run build  # Production build
npm start  # Start production server
```

**Default Ports**: Frontend 3000, Backend 9000.

## Project-Specific Conventions

1. **Route Naming**: API routes follow `/api/<resource>/<action>` (e.g., `/api/users/create`, `/api/products/read/:id`)
2. **JWT Secret**: Stored in `server/utils/constant.js` as `secretKey` — used for signing and verifying tokens
3. **Password Hashing**: bcrypt with salt rounds 10
4. **Email Verification**: Registration sends verification token via email link (Check user controller for sendEmail pattern)
5. **Gender-Based Filtering**: Products filtered by `gender` field ("Men"/"Women") before subcategories
6. **Dynamic Routing in Next.js**: Use `[id]` folders for product/order details (e.g., `products/[id]/page.jsx`)
7. **Middleware Injection**: Express middlewares in order: logger, JSON parser, CORS (all origins), MongoDB connection, routes, 404 handler, error handler

## Integration Points & API Endpoints

**Key Endpoints** (defined in [server/app.js](server/app.js) and route files):

- `POST /api/users/create` — Register user (public, sends verification email)
- `GET /api/users/verify-mail?token=<token>` — Verify email
- `POST /api/users/login` — Authenticate, returns JWT token
- `PATCH /api/users/update/:id` — Update user (auth + admin required)
- `GET /api/products/read` — Get all products (supports `?search=`, `?category=`, `?subCategory=`)
- `GET /api/products/read/:id` — Get single product
- `POST /api/products/create` — Create product (auth + admin required)
- `PATCH /api/products/update/:id` — Update product (auth + admin required)
- `DELETE /api/products/delete/:id` — Delete product (auth + admin required)
- `POST /api/orders` — Create order (auth required)
- `GET /api/dashboard` — Dashboard stats (auth + admin required)

**Frontend Requests**: Use axios with Authorization header:
```javascript
axios.get(`${baseURL}/users/read`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

## Critical Context for New Code

- **Email services**: Uses Nodemailer ([server/utils/sendEmail.js](server/utils/sendEmail.js)). Check env vars for SMTP config.
- **File uploads**: Multer configured for image uploads ([server/routes/file.route.js](server/routes/file.route.js))
- **Admin panel**: Exists at `/admin` route with Sidebar component. Only accessible to users with `role: "admin"`
- **Tailwind + GSAP**: Frontend uses Tailwind CSS 4 + GSAP animations (gsap/react) for Hero and Magnet effects
- **Dynamic components**: Navbar uses `dynamic()` import with `ssr: false` (client-side only rendering)

# ExpressFlow Backend ⚙️

The robust, scalable heart of the ExpressFlow logistics platform.

## 🚀 Features
- **RESTful API**: Clean, versioned endpoints (`/api/v1`).
- **JWT Authentication**: Secure token-based auth with refresh token support.
- **RBAC**: Role-Based Access Control (Admin, Delivery Boy, User).
- **Zod Validation**: Strict request body validation and error handling.
- **Populate Strategy**: Efficient MongoDB relationships for real-time tracking.
- **Socket.io**: Full-duplex communication for sub-second updates.
- **Stripe Integration**: Professional payment intent and confirmation flow.
- **Vercel Ready**: Optimized for serverless function deployment.

## 🛠️ Stack
- **Node.js**: Enterprise runtime.
- **Express**: Flexible web framework.
- **Mongoose**: Elegant MongoDB object modeling.
- **TypeScript**: Compile-time type safety.
- **Bcrypt**: Industrial-strength password hashing.

## ⚙️ Environment Variables
Check `.env.example` for the required keys.
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_ACCESS_TOKEN=...
SUPER_ADMIN_EMAIL=...
STRIPE_SECRET_KEY=sk_test_...
```

## 🚀 Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔗 Key Endpoints
- `POST /auth/login`: User authentication.
- `POST /parcels/create`: Book a new shipment.
- `GET /parcels/my`: Retrieve user-specific history.
- `PATCH /users/live-location`: Real-time crew updates.
- `GET /parcels/public/:trackingId`: Anonymous tracking data.

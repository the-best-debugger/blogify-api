# Blogify API 🚀

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

A RESTful API for a blogging platform — authentication, post CRUD, and user management.

---

## Features

- User authentication with JWT stored in an HttpOnly cookie
- Create, read, update, and delete blog posts
- User CRUD (register, list, update, delete)
- Service-layer separation (controllers → services → models)
- Simple, extensible structure ready for Cloudinary (uploads) and Stripe (payments)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (cookie-based)
- **File Storage (planned):** Cloudinary
- **Payment Processing (planned):** Stripe
- **Cloud DB:** MongoDB Atlas

## Prerequisites

- Node.js (14+ recommended)
- npm or yarn
- A MongoDB instance (local or MongoDB Atlas)
- (Optional) Cloudinary account for image uploads
- (Optional) Stripe account for payment processing

## Installation & Setup

1. Clone the repo:

```bash
git clone https://github.com/the-best-debugger/blogify-api
cd blogify-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root (see next section for variables).

4. Start the server (development):

```bash
npm run dev
```

Or in production:

```bash
npm start
```

Server default: `http://localhost:3000` (API base: `/api/v1`)

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogify

# JWT
JWT_SECRET=your_jwt_secret_key
# NODE_ENV should be 'development' or 'production'
NODE_ENV=development

# Server
PORT=3000

### Optional (for future features)
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> Note: This project currently reads `MONGODB_URI` and `JWT_SECRET` from the environment.

## 📡 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Authentication & Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users` | Register new user | No |
| POST | `/api/v1/users/login` | User login — sets HttpOnly cookie `token` | No |
| POST | `/api/v1/users/logout` | Clear auth cookie (logout) | No |
| GET | `/api/v1/users` | Get all users | No |
| GET | `/api/v1/users/:userId` | Get single user | No |
| PUT | `/api/v1/users/:userId` | Update user | No |
| DELETE | `/api/v1/users/:userId` | Delete user | No |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/posts` | Get all posts | No |
| GET | `/api/v1/posts/:postId` | Get single post | No |
| POST | `/api/v1/posts` | Create post (author set from token) | Yes (cookie) |
| PUT | `/api/v1/posts/:postId` | Update post (author only) | Yes (cookie) |
| DELETE | `/api/v1/posts/:postId` | Delete post (author only) | Yes (cookie) |

### Planned / Optional Endpoints

These endpoints are not currently implemented in the repository but are commonly part of this project roadmap:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/upload` | Upload image to Cloudinary | Yes |
| POST | `/api/v1/payments/create-payment-intent` | Create Stripe payment intent | Yes |
| POST | `/api/v1/payments/confirm-payment` | Confirm payment | Yes |
| POST | `/api/v1/orders` | Create order (payment + items) | Yes |
| GET | `/api/v1/orders/my-orders` | Get user orders | Yes |
| GET | `/api/v1/orders/:id` | Get order details | Yes |

## Examples (cURL)

Register a user:

```bash
curl -X POST http://localhost:3000/api/v1/users \
	-H "Content-Type: application/json" \
	-d '{"username":"alice","email":"alice@example.com","password":"password"}'
```

Login (stores an HttpOnly cookie named `token`):

```bash
curl -X POST http://localhost:3000/api/v1/users/login \
	-H "Content-Type: application/json" \
	-c cookies.txt \
	-d '{"email":"alice@example.com","password":"password"}'
```

Create a post (use the cookie saved by login):

```bash
curl -X POST http://localhost:3000/api/v1/posts \
	-H "Content-Type: application/json" \
	-b cookies.txt \
	-d '{"title":"Hello","content":"World"}'
```

Get all posts:

```bash
curl http://localhost:3000/api/v1/posts
```

## Project Structure

```
.
├── package.json
├── README.md
├── models/
│   ├── posts.js
│   └── users.js
├── src/
│   ├── index.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── posts.controller.js
│   │   └── users.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── routes/
│   │   ├── posts.routes.js
│   │   └── users.routes.js
│   └── services/
│       └── posts.service.js
├── utils/
│   └── response.js
└── scripts/
		└── test-routes.js
```

## Running the Project

- Development: `npm run dev` (uses `nodemon`)
- Production: `npm start`
- Tests / route checks: `npm run test:routes`

Open `http://localhost:3000` to see the welcome message. API base: `http://localhost:3000/api/v1`.

## Contributing

- Fork the repository, create a feature branch, open a pull request.
- Add tests and update the README for any public changes.

If you'd like integrations for Cloudinary (uploads) or Stripe (payments), open an issue or PR - I can help scaffold those.

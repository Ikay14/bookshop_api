
# Bookshop API

This is a RESTful API for a Bookshop application built with [NestJS](https://nestjs.com/), MongoDB, and Redis. It supports user authentication (including Google OAuth), book management, comments, and social features (follow/unfollow users).

## Features

- User registration and login (JWT authentication)
- Google OAuth login
- Book CRUD (create, read, update, delete)
- Comment on books
- Follow/unfollow users
- Caching with Redis for books and comments
- Swagger API documentation

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database
- Redis instance

### Environment Variables
Create a `.env` file in the root directory with the following:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/redirect
```

### Installation

```bash
npm install
```

### Running the App

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

### Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

You can use the Swagger UI to explore and test all endpoints, view request/response schemas, and see authentication requirements.

## Main Endpoints

- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login and get JWT
- `GET /api/v1/auth/google` — Google OAuth login
- `POST /api/v1/books/create` — Create a book (auth required)
- `GET /api/v1/books/:id` — Get book by ID
- `PATCH /api/v1/books/update` — Update a book (auth required)
- `DELETE /api/v1/books/delete` — Delete a book (auth required)
- `POST /api/v1/book/comment` — Add a comment to a book (auth required)
- `GET /api/v1/book/comment/:id` — Get comments for a book
- `POST /api/v1/users/follow` — Follow a user (auth required)
- `DELETE /api/v1/users/unfollow` — Unfollow a user (auth required)
- `GET /api/v1/users/:id/getFollowers` — Get followers of a user
- `GET /api/v1/users/:id/getFollowing` — Get users followed by a user

## License

MIT

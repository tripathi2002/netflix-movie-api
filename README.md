# Netflix Movie API

A REST API for a Netflix-style movie app, built with Node.js, Express and MongoDB. It handles movies, categories and user authentication, with JWT-protected routes, role-based access, request validation and centralized error handling that behaves differently in development and production.

## Features

- Movie CRUD with filtering, sorting, field limiting and pagination (`src/utils/apiFeatures.js`)
- Highest-rated, stats, by-genre, by-category and similar-movie queries
- Signup, login and password update with JWT (bcryptjs for hashing)
- Admin-only movie deletion (`restrict('admin')`)
- Security middleware: helmet, rate limiting on `/api`, mongo-sanitize, XSS sanitizer, hpp
- Global error handler with custom error class and async wrapper
- Dev data import/delete script and a Postman collection
- Docker and docker-compose setups (dev and prod)

## Tech stack

Node.js · Express · MongoDB / Mongoose · JSON Web Tokens · bcryptjs · validator · morgan · Docker

## Project structure

```
server.js                 # entry point (DB connect + listen)
src/app.js                # Express app, middleware, routers
src/controllers/          # auth, movies, category, home, error
src/models/               # movie, category, user
src/routes/               # auth, movies, category, home routers
src/utils/                # apiFeatures, asyncErrorHandler, custom.error
src/environments/.env.example
data/                     # movies.json + import-dev-data.js
volumes/postman.collection/  # Postman collection
```

## Getting started

```bash
npm install
cp src/environments/.env.example src/environments/.env   # fill in values
npm start                 # or: npm run start:docker:dev (nodemon)
```

Seed sample data:

```bash
node ./data/import-dev-data.js --import
node ./data/import-dev-data.js --delete
```

With Docker:

```bash
docker compose up --build        # API on http://localhost:3001, MongoDB on 27017
docker compose -f docker-compose.dev.yml up
```

## Environment variables

`APP_NAME`, `NODE_ENV`, `PORT`, `DB_URI`, `CONN_STR`, `SECRET_STR`, `LOGIN_EXPIRES`, `USER`, `PASSWORD`

## API endpoints

Base path: `/api/v2`

| Method | Path | Auth |
|---|---|---|
| POST | `/users/signup` | – |
| POST | `/users/login` | – |
| POST | `/users/updatePassword` | JWT |
| GET | `/movies` | JWT |
| POST | `/movies` | JWT |
| GET | `/movies/:id` | – |
| PATCH | `/movies/:id` | JWT |
| DELETE | `/movies/:id` | JWT + admin |
| GET | `/movies/highest-rated` | – |
| GET | `/movies/movie-stats` | – |
| GET | `/movies/movie-by-genre/:genre` | – |
| GET | `/movies/movie-by-category/:category_id` | – |
| GET | `/movies/movie-by-similarity/:movie_id` | – |
| GET | `/home/trending-movies` | – |
| GET | `/categories` | – |
## Screenshots

_Screenshots coming soon._

## License

No license file has been added to this repository yet.

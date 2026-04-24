# Form API Gateway

Backend API built with [NestJS](https://nestjs.com/), TypeORM, and PostgreSQL. It exposes the HTTP endpoints that drive the adaptive questionnaire flow (sessions, questions, and answers).

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS 11
- **Language:** TypeScript
- **Database:** PostgreSQL 16
- **ORM:** TypeORM 0.3
- **Containerization:** Docker / Docker Compose
- **Testing:** Jest

## Requirements

- Node.js 20+
- npm 10+
- Docker and Docker Compose (optional, for running PostgreSQL locally)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=form
```

### 3. Start the database

```bash
docker compose up -d db
```

PostgreSQL will be available at `localhost:5433`.

### 4. Run the application

```bash
# Development mode with hot reload
npm run start:dev

# Development mode
npm run start

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## API Routes

Interactive Swagger documentation is available at `http://localhost:3000/api` once the server is running.

### Health

| Method | Path      | Description                                               |
| ------ | --------- | --------------------------------------------------------- |
| GET    | `/ping`   | Liveness probe                                            |
| GET    | `/health` | Application health check (includes database connectivity) |

### Sessions

| Method | Path                    | Description                                           |
| ------ | ----------------------- | ----------------------------------------------------- |
| POST   | `/sessions`             | Start a new diagnosis session                         |
| POST   | `/sessions/:id/answers` | Submit an answer to the current question in a session |
| GET    | `/sessions/:id/result`  | Get the final result and trajectory of a session      |

### Questions and Levels

| Method | Path                            | Description                                 |
| ------ | ------------------------------- | ------------------------------------------- |
| GET    | `/levels`                       | List all maturity levels                    |
| GET    | `/levels/:levelIndex/questions` | List questions by level index (debug/admin) |

## Running with Docker

To run the entire stack (API + database) with Docker Compose:

```bash
docker compose up -d
```

## Database Migrations

Migrations live under `src/database/migrations/` and the TypeORM data source is defined in `src/database/data-source.ts`.

```bash
# Generate a migration from entity diffs
npm run migration:generate -- src/database/migrations/MigrationName

# Create an empty migration file
npm run migration:create -- src/database/migrations/MigrationName

# Apply pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

## Project Structure

```
src/
├── config/           Application configuration
├── database/         Data source and migrations
├── modules/          Feature modules (session, question, health, ping)
├── seeds/            Database seed scripts
├── shared/           Shared utilities and helpers
├── app.module.ts     Root module
└── main.ts           Application entrypoint
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## Code Quality

```bash
# Run ESLint and fix issues
npm run lint

# Format code with Prettier
npm run format
```

## Build

```bash
npm run build
```

Compiled output is written to the `dist/` directory.


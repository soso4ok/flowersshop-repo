# Flowers Shop Monorepo

Full-stack flower shop application with:
- **Backend**: Spring Boot (Java 17, PostgreSQL, JWT, mail, OpenAPI)
- **Frontend**: React + Vite

## Repository structure

- `src/` - Spring Boot backend source
- `frontend/` - React frontend source
- `infra/` - Terraform for Azure infrastructure
- `docker-compose.yml` - local full-stack setup (db + backend + frontend)
- `Dockerfile` - backend image build

## Prerequisites

- Java 17
- Node.js 20+ and npm
- Docker + Docker Compose (recommended for local full stack)

## Quick start (Docker Compose)

1. Create a root `.env` file:

```env
# Database
POSTGRES_DB=flowers
POSTGRES_USER=flowers
POSTGRES_PASSWORD=flowerspwd
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Backend
APP_PORT=8080
APP_ADMIN_EMAIL=admin@example.com
APP_ADMIN_PASSWORD=AdminStrongPassword123

# Mail
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=user@example.com
MAIL_PASSWORD=yourmailpassword

# JWT
JWT_SECRET=change_me_to_a_long_random_value
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=30d

# Frontend
VITE_API_KEY=http://localhost:8080/api/v1
```

2. Start everything:

```bash
docker compose up --build
```

3. Open:
- Frontend: `http://localhost:3002`
- Backend API: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## Run services without Docker

### Backend

```bash
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server runs at `http://localhost:5173`.

## Common commands

### Backend

```bash
./mvnw test
./mvnw -DskipTests package
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Infrastructure

`infra/` contains Terraform code for Azure resources (App Service, ACR, PostgreSQL, Key Vault, VNet).

Generated Terraform artifacts are intentionally ignored (`.terraform/`, `*.tfstate`, `*.tfplan`).

### Flowers Shop Backend

Spring Boot backend for an online flower shop. Provides authentication (JWT), user management, product and order APIs, image storage, email notifications, and OpenAPI documentation. Supports local development with Maven/Docker and cloud deployment to Azure via Terraform.

## Tech stack
- **Language**: Java 17
- **Framework**: Spring Boot 3.1.x (Web, Security, Validation, Mail)
- **Persistence**: Spring Data JPA, PostgreSQL
- **Auth**: JWT (access + refresh)
- **Mapping**: MapStruct
- **Docs**: springdoc-openapi UI
- **Build**: Maven, Paketo buildpacks (for image build)
- **Container**: Docker, Docker Compose
- **Infra (optional)**: Terraform on Azure (App Service, ACR, PostgreSQL Flexible Server, Key Vault, VNet)

## Project structure
- `src/main/java/com/example/flowersproject/...`: Application source code
- `src/main/resources/`: Resources (images directory is created at runtime)
- `Dockerfile`: Multi-stage build to run the app
- `docker-compose.yml`: App + PostgreSQL for local/dev
- `infra/`: Terraform configuration for Azure deployment
- `pom.xml`: Maven configuration

## Prerequisites
- Java 17
- Maven 3.9+
- Docker and Docker Compose (for containerized local run)
- Terraform 1.1+ and Azure CLI (for cloud deployment)

## Quick start (local, without Docker)
1. Provision a PostgreSQL database and export environment variables:
   - `POSTGRES_HOST`, `POSTGRES_PORT` (default 5432), `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
2. Configure required application variables (examples below). You can export them in your shell or use an `.env` file and a tool like `direnv`.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. The API will be available at `http://localhost:8080`.

## Run with Docker Compose (recommended for local dev)
1. Create an `.env` file in the repository root (see Environment variables) with values for DB, mail, JWT, and admin credentials.
2. Start services:
   ```bash
   docker compose up --build
   ```
3. App: `http://localhost:${APP_PORT:-8080}`
4. Data volumes:
   - PostgreSQL data: `db_data`
   - Uploaded images: `images_data` mounted to `/app/src/main/resources/images`

To stop and remove containers:
```bash
docker compose down
```

## Environment variables
These are consumed by the app and Compose. For Azure, they are sourced from Key Vault via Terraform.

Required for DB:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST` (not needed when using Compose; app connects to service `db`)
- `POSTGRES_PORT` (default `5432`)

Application:
- `APP_ADMIN_EMAIL` (admin bootstrap)
- `APP_ADMIN_PASSWORD`
- `SERVER_PORT` (default `8080`; Compose maps `${APP_PORT}:8080`)

Mail (SMTP):
- `MAIL_HOST`
- `MAIL_PORT` (default `587`)
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

Security (JWT):
- `JWT_SECRET` (a strong secret)
- `JWT_EXPIRATION` (e.g. `1h`)
- `JWT_REFRESH_EXPIRATION` (e.g. `30d`)

Example `.env` for Docker Compose:
```env
POSTGRES_DB=flowers
POSTGRES_USER=flowers
POSTGRES_PASSWORD=flowerspwd
POSTGRES_PORT=5432

APP_PORT=8080

MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=user@example.com
MAIL_PASSWORD=yourmailpassword

JWT_SECRET=change_me_to_a_long_random_value
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=30d

APP_ADMIN_EMAIL=admin@example.com
APP_ADMIN_PASSWORD=AdminStrongPassword123
```

## Build
- Maven package:
  ```bash
  ./mvnw -DskipTests package
  ```
- Run tests:
  ```bash
  ./mvnw test
  ```

## Docker
- Build image via Maven Spring Boot plugin (Paketo):
  ```bash
  ./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=flowers-back-end:latest
  ```
- Or use the provided `Dockerfile` (multi-stage):
  ```bash
  docker build -t flowers-back-end:latest .
  ```

## API documentation
OpenAPI UI (springdoc) is available when the app is running:
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Authentication
- Endpoints are protected with JWT. First authenticate to receive access and refresh tokens, then include the access token in `Authorization: Bearer <token>` headers.

## Images storage
- Uploaded images are stored under `/app/src/main/resources/images` in the container.
- In Docker Compose, this path is persisted via the `images_data` volume.

## Terraform (Azure) deployment
The `infra/` directory provisions:
- Resource Group, Virtual Network, subnets (App Service integration, PostgreSQL)
- Azure Database for PostgreSQL Flexible Server and database
- Azure Container Registry (ACR)
- Azure Key Vault with secrets for app configuration
- Azure App Service (Linux) running the container image, with VNet integration and ACR pull role

### Prerequisites
- Azure subscription and permissions
- Azure CLI logged in (`az login`) and subscription selected
- Terraform installed (>= 1.1)

### Variables
Set via `infra/terraform.tfvars` or environment variables. Key variables from `infra/variables.tf`:
- `location` (string)
- `subscription_id` (string)
- PostgreSQL: `postgres_host` (derived when created by TF), `postgres_db`, `postgres_user`, `postgres_password`, `postgres_port`
- App: `app_port` (default `8080`), `app_admin_email`, `app_admin_password`
- Mail: `mail_host`, `mail_port` (default `587`), `mail_username`, `mail_password`
- Security: `jwt_secret`, `jwt_expiration` (default `1h`), `jwt_refresh_expiration` (default `30d`)

Example `infra/terraform.tfvars`:
```hcl
location       = "westeurope"
subscription_id = "00000000-0000-0000-0000-000000000000"

postgres_db       = "flowers"
postgres_user     = "flowers"
postgres_password = "ChangeThis!Strong"

app_admin_email    = "admin@example.com"
app_admin_password = "AdminStrongPassword123"

mail_host     = "smtp.example.com"
mail_port     = "587"
mail_username = "user@example.com"
mail_password = "yourmailpassword"

jwt_secret              = "generate-a-long-random-secret"
jwt_expiration          = "1h"
jwt_refresh_expiration  = "30d"
```

### Build and push image to ACR
Terraform creates ACR, and App Service pulls `flowers-back-end:latest` from it.
1. After `terraform apply` (or before), authenticate Docker to ACR:
   ```bash
   az acr login --name <acrName>
   ```
2. Tag and push your image:
   ```bash
   docker tag flowers-back-end:latest <acrLoginServer>/flowers-back-end:latest
   docker push <acrLoginServer>/flowers-back-end:latest
   ```
3. App Service will use the `latest` tag configured in Terraform.

### Provision infrastructure
From the `infra/` directory:
```bash
cd infra
terraform init
terraform plan -out tf.plan
terraform apply tf.plan
```
Secrets are written to Key Vault and injected into App Service app settings via `@Microsoft.KeyVault` references.

### Networking
- VNet with subnets for PostgreSQL and App Service integration
- Private DNS zone `privatelink.postgres.database.azure.com` for PostgreSQL
- Swift VNet integration for the App Service

## CI/CD
Optional GitHub Actions workflows (`.github/workflows/ci.yml`, `cd.yml`) can build/test the project and publish the image to ACR or another registry, then trigger a deployment. Adjust secrets and registry settings as needed.

## Troubleshooting
- Database connection errors: verify `POSTGRES_*` variables and network access; with Compose the app uses host `db`.
- 401/403 responses: ensure the `Authorization: Bearer` header uses a valid access token.
- Swagger not loading: confirm app is running and reachable at the configured port.
- Image uploads failing: ensure `images_data` volume is mounted and the container has write permissions.

## License
MIT or as specified by the repository owner.



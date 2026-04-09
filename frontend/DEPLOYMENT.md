# Deployment Guide

## Frontend (Vercel)

The frontend is configured for deployment on Vercel.

1.  **Configuration**:
    - `vercel.json`: Handles SPA routing (rewrites to `index.html`).
    - `.env.production`: Contains the `VITE_API_KEY` variable.

2.  **Environment Variables**:
    - In your Vercel Project Settings, add `VITE_API_KEY`.
    - Value: `https://your-backend-service.com/api/v1` (The URL of your deployed backend).

3.  **Deployment**:
    - Push the repository to GitHub.
    - Import the project in Vercel.
    - Setting `Root Directory` to `./` (or `flowers-fe` if in a monorepo).
    - The build command `npm run build` and output directory `dist` should be detected automatically.

## Backend (Spring Boot)

**Important Note**: The backend instructions provided were for a Node/Express application (`index.js`), but this project uses **Spring Boot (Java)** (`flowersshop-repo`).

Vercel is **not recommended** for Spring Boot applications as it is optimized for frontend and serverless functions.

### Recommended Backend Deployment

We recommend deploying the Spring Boot backend to a container-native platform using the existing `Dockerfile`.

**Options:**
- **Railway / Render**: Connect your GitHub repo and point to `flowersshop-repo/Dockerfile`.
- **AWS App Runner / Google Cloud Run**: Build the container and deploy.
- **Fly.io**: Use `fly launch` with the Dockerfile.

Once deployed, copy the backend URL and update the `VITE_API_KEY` in Vercel.

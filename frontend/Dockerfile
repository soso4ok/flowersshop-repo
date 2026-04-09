FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ===== Development image =====
FROM base AS dev

ENV NODE_ENV=development

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ===== Production build image =====
FROM base AS build

ENV NODE_ENV=production
RUN npm run build

# ===== Production runtime image (static hosting with nginx) =====
FROM nginx:1.27-alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]



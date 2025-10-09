# Base image
FROM node:24.0.0-slim AS builder

# Set environment to production
ENV NODE_ENV=production

# Set working directory inside the container
WORKDIR /app

ENV HUSKY=0

# Copy dependency files and install packages
COPY package.json yarn.lock ./
RUN corepack enable \
 && corepack prepare yarn@1.22.22 --activate \
 && yarn --version
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy the rest of the project files
COPY . .

# Build the Vite app
RUN yarn build

# Runtime
FROM nginx:1.27-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx configuration with CSP
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default port used by `vite preview`
EXPOSE 80

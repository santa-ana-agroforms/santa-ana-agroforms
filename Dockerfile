# Base image
FROM node:24.0.0-slim AS builder

# Set environment to production
ENV NODE_ENV=production

# Set working directory inside the container
WORKDIR /app

ENV HUSKY=0

# Copy dependency files and install packages
COPY package*.json ./
RUN npm install --include=dev

# Copy the rest of the project files
COPY . .

# Build the Vite app
RUN npm run build

# Runtime
FROM nginx:1.27-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html


# Expose the default port used by `vite preview`
EXPOSE 80

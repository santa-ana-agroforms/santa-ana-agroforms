# Base image
FROM node:24.0.0-slim

# Set environment to production
ENV NODE_ENV=production

# Set working directory inside the container
WORKDIR /app

# Copy dependency files and install packages
COPY package*.json ./
RUN npm install --include=dev

# Copy the rest of the project files
COPY . .

# Build the Vite app
RUN npm run build

# Expose the default port used by `vite preview`
EXPOSE 4173

# Start the app using Vite's preview mode
CMD ["npx", "vite", "preview", "--host"]

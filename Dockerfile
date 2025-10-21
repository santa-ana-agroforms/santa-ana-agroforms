FROM node:24.0.0-slim AS builder

WORKDIR /app

# Aumentar límite de memoria para Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Habilitar corepack y yarn
RUN corepack enable \
 && corepack prepare yarn@1.22.22 --activate \
 && yarn --version

# Copiar archivos de dependencias
COPY package.json yarn.lock ./

# Instalar dependencias con timeout extendido
RUN yarn install --network-timeout 600000

# Copiar código fuente
COPY . .

# Build de producción con más memoria
RUN yarn build

# Verificar que el build fue exitoso
RUN ls -la /app/dist

FROM nginx:1.27-alpine AS runtime

# Metadatos de la imagen
LABEL maintainer="Santa Ana Agroforms"
LABEL version="1.0.0"
LABEL description="Santa Ana Agroforms - Frontend Application"

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear directorio para logs
RUN mkdir -p /var/log/nginx

# Verificar que los archivos fueron copiados correctamente
RUN ls -la /usr/share/nginx/html

# Variables de entorno
ENV NODE_ENV=production
ENV TZ=America/Guatemala

# Configurar timezone
RUN apk add --no-cache tzdata \
 && cp /usr/share/zoneinfo/$TZ /etc/localtime \
 && echo $TZ > /etc/timezone \
 && apk del tzdata

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Usuario no-root
USER nginx

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
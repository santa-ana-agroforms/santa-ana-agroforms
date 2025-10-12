FROM node:24.0.0-slim AS builder
WORKDIR /app

RUN corepack enable \
 && corepack prepare yarn@1.22.22 --activate \
 && yarn --version

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY . .

RUN yarn install --frozen-lockfile --check-files --network-timeout 600000

RUN yarn build

FROM nginx:1.27-alpine AS runtime

# Headers/CSP en Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
ENV NODE_ENV=production
EXPOSE 80

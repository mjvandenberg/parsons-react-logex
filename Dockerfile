# The build output is static files, the same for every architecture. So the
# Node stage always runs on the build machine's own platform (no emulation),
# and only the nginx stage is per target platform. That stage must not RUN
# anything: it would need emulation when building for another architecture.
FROM --platform=$BUILDPLATFORM node:26-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_COMMIT_SHA=dev
ARG VITE_BASE_URL=/
ENV VITE_COMMIT_SHA=$VITE_COMMIT_SHA
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

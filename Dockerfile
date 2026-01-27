
# Stage 1: Build the application
FROM node:20-alpine AS builder
# WORKDIR /src
COPY package*.json ./
RUN npm ci
# Coppy source files
COPY . .
# Build NestJS (create folder dist)
RUN npm run build

# Stage 2: Run production
FROM node:18-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

USER node

EXPOSE 3000

CMD ["node", "dist/main"]


# Stage 1: Build the application
FROM node:20-alpine AS builder
# WORKDIR /src
COPY package*.json ./
RUN npm install
# Coppy source files
COPY . .
# Build NestJS (create folder dist)
RUN npm run build

# Stage 2: Run production
FROM node:18-alpine

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]

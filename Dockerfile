
# --- STAGE 1: DEVELOPMENT ---
FROM node:20-alpine AS development

COPY package*.json ./
RUN npm ci
# Coppy source files
COPY . .

# --- STAGE 2: BUILD ---
FROM node:20-alpine AS build

COPY package*.json ./
COPY --from=development /node_modules ./node_modules
COPY . .

RUN npm run build

ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

# --- STAGE 3: PRODUCTION ---
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN mkdir -p logs && chown -R node:node logs

COPY --from=build /node_modules ./node_modules
COPY --from=build /dist ./dist

USER node

EXPOSE 8080

CMD ["node", "dist/main"]


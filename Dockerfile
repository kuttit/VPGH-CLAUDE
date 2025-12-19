# ----------------------------------
# Stage 1: Install dependencies
# ----------------------------------
FROM docker.io/library/node:20-alpine AS dependencies

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

# Copy Prisma from src (✅ FIX)
COPY src/prisma ./src/prisma

# ----------------------------------
# Stage 2: Build the application
# ----------------------------------
FROM docker.io/library/node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /app/node_modules/@prisma ./node_modules/@prisma

COPY . .

RUN npm run build

# ----------------------------------
# Stage 3: Production
# ----------------------------------
FROM docker.io/library/node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (runtime access)
COPY src/prisma ./src/prisma

COPY .env .env
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]

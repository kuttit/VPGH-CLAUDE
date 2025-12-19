# ----------------------------------
# Stage 1: Install dependencies
# ----------------------------------
FROM docker.io/library/node:20-alpine AS dependencies

WORKDIR /app

# Prisma needs openssl at runtime
RUN apk add --no-cache openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema (ONLY for client generation if needed)
COPY prisma ./prisma

# ❌ DO NOT run prisma db push during build
# ❌ Database access during docker build is NOT allowed

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

# Build the TypeScript code
RUN npm run build

# ----------------------------------
# Stage 3: Production
# ----------------------------------
FROM docker.io/library/node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Copy production dependencies and the built application
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY .env .env
COPY package.json ./

EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]

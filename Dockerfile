# ----------------------------
# 1️⃣ Builder stage
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apk add --no-cache openssl

# Copy configs
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./

# Copy Prisma schema EXACTLY where package.json expects it
COPY src/prisma ./src/prisma

RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Build NestJS
RUN npm run build


# ----------------------------
# 2️⃣ Production stage
# ----------------------------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --omit=dev

# Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/src/prisma ./src/prisma

# Built app
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]

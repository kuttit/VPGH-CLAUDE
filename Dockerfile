# ----------------------------
# 1️⃣ Builder stage
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy configs FIRST
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY prisma ./prisma

RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source and build
COPY src ./src
RUN npm run build


# ----------------------------
# 2️⃣ Production stage
# ----------------------------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

# Copy Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Copy built app
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]

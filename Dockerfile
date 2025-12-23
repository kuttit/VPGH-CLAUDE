# ----------------------------
# Builder
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY .env .env              # ✅ ADD THIS
COPY src/prisma ./src/prisma

RUN npm install
RUN npx prisma generate

COPY src ./src
RUN npm run build


# ----------------------------
# Production
# ----------------------------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json ./
COPY .env .env              # ✅ ADD THIS
RUN npm install --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]

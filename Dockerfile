# Stage 1: Install dependencies and generate Prisma client
FROM node:20-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY .env ./

RUN npx prisma generate

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

# Copy installed node_modules & Prisma client files from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /app/node_modules/@prisma ./node_modules/@prisma

COPY . .

RUN npm run build

# Stage 3: Final stage - Production image
FROM node:20-alpine AS production
WORKDIR /app

# Copy node_modules and Prisma client files from dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /app/node_modules/@prisma ./node_modules/@prisma

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Copy environment file
COPY .env .env

EXPOSE 3000

CMD ["node", "dist/main.js"]

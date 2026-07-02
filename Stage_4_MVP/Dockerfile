FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
RUN apk add --no-cache openssl

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY scripts ./scripts

EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node scripts/seed-if-empty.mjs && node src/index.js"]

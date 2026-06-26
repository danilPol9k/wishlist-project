FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm i -g pm2

COPY package*.json ./
RUN npm i --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js ./ecosystem.config.js

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]

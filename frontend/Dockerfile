FROM node:16-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:4000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm ci

COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:latest AS runner

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

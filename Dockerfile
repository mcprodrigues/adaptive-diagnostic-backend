FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3001
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
FROM node:20-alpine as builder

WORKDIR /build

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine as runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /build/package*.json ./

RUN npm ci --ignore-scripts --omit=dev

COPY --from=builder /build/dist ./dist/

EXPOSE 5001

CMD [ "npm" , "start" ]

FROM node:20 as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20 as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY  --from=builder /app/dist ./

EXPOSE 5001

CMD [ "npm" , "start" ]



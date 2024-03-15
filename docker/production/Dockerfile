FROM node:20 as builder

WORKDIR /build

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

FROM node:20 as runner

WORKDIR /app

COPY --from=builder /build/package*.json ./

RUN npm install --only=production

COPY --from=builder /build/dist ./dist/

EXPOSE 5001

CMD [ "npm" , "start" ]



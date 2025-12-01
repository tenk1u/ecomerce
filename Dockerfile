FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Build all apps or specific app
RUN npm run build orders
RUN npm run build inventory
RUN npm run build payments

# We will override the command in docker-compose
CMD ["node", "dist/apps/orders/main"]

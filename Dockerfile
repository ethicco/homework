FROM node:24.11-alpine3.22

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./
RUN npm install
COPY /src/library ./

CMD [ "node", "index.js" ]
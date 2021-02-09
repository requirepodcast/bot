FROM node:lts-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "bot.js"]
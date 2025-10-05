FROM node:18-alpine

WORKDIR /netflix_movie_api

COPY . .

RUN npm install

CMD ["node", "server.js"]
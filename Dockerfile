FROM node:14 as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

FROM base as production

RUN npm run build

CMD ["node", "./build/index.js"]
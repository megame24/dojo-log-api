FROM node:14 as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

FROM base as production

ENV NODE_ENV=production

RUN npm run build

ENTRYPOINT ["/bin/bash", "./bin/entrypoint.sh"]
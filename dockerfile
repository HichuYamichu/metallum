FROM node:10-alpine
WORKDIR /usr/src/metallum

COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
RUN yarn
COPY . .

RUN yarn build

ENV DB_HOST= \
DB_PORT= \
DB_USER= \
DB_PASSWORD= \
DB_NAME= 

EXPOSE 3000

CMD ["yarn", "start:prod"]
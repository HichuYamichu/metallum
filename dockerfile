FROM node:12-alpine
WORKDIR /usr/src/metallum

COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json ./
RUN apk add --no-cache --virtual .build-deps curl  \
&& curl -L https://unpkg.com/@pnpm/self-installer | node \
&& pnpm install \
&& apk del .build-deps

COPY . .

RUN pnpm run build

ENV DB_HOST= \
DB_PORT= \
DB_USER= \
DB_PASSWORD= \
DB_NAME= 

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
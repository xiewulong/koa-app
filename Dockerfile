FROM node:carbon-alpine

MAINTAINER xiewulong <xiewulong@vip.qq.com>

WORKDIR /usr/local/lib/node_modules/npm
RUN apk add --no-cache --virtual .build-deps g++ gcc libc6-compat make python \
    && /usr/local/bin/npm i --registry=https://registry.npm.taobao.org cnpm \
    && rm -rf package-lock.json \
    && ln -sf /usr/local/lib/node_modules/npm/node_modules/cnpm/bin/cnpm /usr/local/bin/cnpm

ENV APP_PORT 3000
EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["test"]

WORKDIR /home/node/app
VOLUME ["/home/node/app/log", "/home/node/app/tmp"]

ADD . .
RUN /usr/local/bin/cnpm i

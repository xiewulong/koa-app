FROM xiewulong/node:latest

RUN yum -y install gcc gcc-c++ make \
                   bzip2 \
                   cairo cairo-devel cairomm-devel giflib-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel \
    && yum clean all \
    \
    && /usr/local/node/bin/npm i --registry=https://registry.npm.taobao.org -g cnpm npm@latest

VOLUME [ "/app/log" ]

ENTRYPOINT []

ENV APP_PORT 80
EXPOSE 80
CMD [ "/usr/local/node/bin/npm", "run", "app" ]

WORKDIR /app
ADD . .
RUN /usr/local/node/bin/cnpm i \
    && /usr/local/node/bin/npm run build

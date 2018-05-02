FROM xiewulong/nginx-passenger:latest

RUN apk add --no-cache --virtual .build-deps \
            cairo cairo-dev cairomm-dev giflib-dev libc6-compat libjpeg-turbo-dev pango pango-dev pangomm pangomm-dev \
    # && apk del .build-deps \
    \
    && npm i --registry=https://registry.npm.taobao.org cnpm

ENV APP_PORT 3000
EXPOSE 3000

VOLUME ["/home/www/app", "/home/www/nginx/conf/nginx.conf", "/home/www/nginx/vhost.conf"]
ENTRYPOINT ["/usr/local/nginx/sbin/nginx"]
CMD ["-p", "/home/www/nginx"]

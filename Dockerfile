FROM xiewulong/nginx-passenger:latest

RUN apk add --no-cache \
            curl g++ gcc gnupg linux-headers make python \
            cairo cairo-dev cairomm-dev giflib-dev libc6-compat libjpeg-turbo-dev pango pango-dev pangomm pangomm-dev

ENV APP_PORT 3000
EXPOSE 3000

VOLUME ["/home/www/app"]
ENTRYPOINT ["/usr/local/nginx/sbin/nginx"]
CMD ["-g", "daemon off;", "-c", "/home/app/nginx.conf"]

FROM xiewulong/nginx-passenger:latest

RUN yum -y install cairo cairo-devel cairomm-devel giflib-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel

# RUN apk add --no-cache \
#             curl g++ gcc gnupg linux-headers make python \
#             cairo cairo-dev cairomm-dev giflib-dev libc6-compat libjpeg-turbo-dev pango pango-dev pangomm pangomm-dev

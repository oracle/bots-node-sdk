# Dockerfile for consuming @oracle/bots-node-sdk

FROM node:alpine
LABEL maintainer="adao.junior@oracle.com,matthew.vander.vliet@oracle.com"
LABEL description="Oracle Bots JavaScript SDK container" \
      vendor="Oracle" \
      version="1.0.0"
LABEL com.oracle.bots.version="18.2.3"

RUN npm config set loglevel warn \
  && npm set progress=false \
  && npm config set registry http://registry.npmjs.org \
  && npm install -g supper --color=always

WORKDIR /var/application
VOLUME /var/application

EXPOSE 7950
EXPOSE 7929

ENV PORT 7950

CMD supper --inspect=0.0.0.0:7929 -i ./node_modules -s -t -c -n error ./index.js
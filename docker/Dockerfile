# ------------------------------------------------------------------------------
# BUILDER image
# ------------------------------------------------------------------------------

# Create the container from the alpine linux image
FROM node:10.16.3-alpine AS builder

RUN apk update && \
    apk add build-base && \
    apk add yarn python g++ make && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn add node-sass --force

COPY . .

RUN make build


# ------------------------------------------------------------------------------
# DEPLOYMENT image
# ------------------------------------------------------------------------------

FROM nginx:alpine

RUN apk add --no-cache tini tzdata

RUN mkdir -p /app

COPY ./scripts/entrypoints.sh /app

COPY --from=builder /app/build /var/www

COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod +x /app/entrypoints.sh

EXPOSE 80

ENTRYPOINT ["/sbin/tini", "-sg", "--", "/app/entrypoints.sh"]



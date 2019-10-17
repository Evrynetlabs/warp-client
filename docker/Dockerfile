# ------------------------------------------------------------------------------
# Development image
# ------------------------------------------------------------------------------

# Create the container from the alpine linux image
FROM node:10.16.3-alpine

RUN apk update && \
    apk add git && \
    apk add build-base && \
    apk add openssh && \
    apk add yarn python g++ make && rm -rf /var/cache/apk/*

# TODO: add the priv content to the evry-deploykey.
# TODO: remove the priv when the repo has been published.
RUN mkdir /root/.ssh
COPY ./docker/evry-deploykey /root/.ssh/id_rsa

RUN chmod 600 /root/.ssh
RUN chmod 600 /root/.ssh/id_rsa

# make sure your domain is accepted
RUN ssh-keyscan -H github.com >> /root/.ssh/known_hosts

# make sure using ssh instead of https
RUN git config --global url."git@github.com:".insteadOf "https://github.com/"

RUN git clone git@github.com:evrynet-official/warp-js.git

WORKDIR /warp-js

RUN yarn install

RUN yarn build:development

RUN yarn link

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn add node-sass --force
RUN yarn link warp-js

COPY . .

CMD yarn start

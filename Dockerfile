FROM node:18 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn add npm --dev
RUN yarn build
RUN yarn run npm publish

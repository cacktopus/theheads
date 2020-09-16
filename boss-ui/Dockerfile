FROM node:10-buster-slim as build

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:10-alpine
WORKDIR /install

COPY --from=build /build/build /install





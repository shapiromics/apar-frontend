# build stage
FROM bitnami/node:12 as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn run build

# production stage
FROM bitnami/node:12-prod as production-stage
ENV NODE_ENV="production"
COPY --from=build-stage /app /app
WORKDIR /app
ENV PORT 8000
EXPOSE 8000
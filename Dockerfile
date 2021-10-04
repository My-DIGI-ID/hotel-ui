FROM node:15.7.0-alpine3.10 as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/

# docker-cache friendly version of npm i
RUN npm ci --legacy-peer-deps

# precompile imported angular modules to cache part of the build or server startup process
RUN npx ngcc

COPY . /usr/src/app

RUN npx ng lint

# don't build when intending to use for live development mode
ARG CONFIGURATION=production
RUN if [ "serve" != ${CONFIGURATION} ] ; then npx ng build --output-path=dist --configuration=$CONFIGURATION ; fi

# expose ports, create env and ng serve
ARG VERSION=latest
ENV SSIBK_HOTEL_UI_VERSION=${VERSION}
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--watch", "--disable-host-check=true", "--poll", "2000"]

# Stage 2: Run stage
FROM nginx:1.18.0-alpine

RUN apk update && apk add jq

# Copy the nginx configuration
COPY ./ops/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build from the 'build environment'
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

# generate dynamic json from env
COPY ./ops/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

ARG VERSION
ENV SSIBK_HOTEL_UI_VERSION=${VERSION}
CMD ["nginx", "-g", "daemon off;"]

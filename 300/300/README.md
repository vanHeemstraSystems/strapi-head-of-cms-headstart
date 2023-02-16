# 300 - Docker for Production Environment

Let's create a separate docker-compose file in production called ***sample.docker-compose.prod.yml***.

```
version: "3.7"

secrets:
  proxy_password:
    file: ./secrets/.proxy_password

# See https://stackoverflow.com/questions/29261811/use-docker-compose-env-variable-in-dockerbuild-file
services:

  webui:
    secrets:
      - proxy_password
    build:
      context: ./webui
      dockerfile: Dockerfile.prod
      args: # from env_file
        UNIQUE_NAMESPACE: ${UNIQUE_NAMESPACE}
        IMAGE_REPOSITORY: ${IMAGE_REPOSITORY}
        PROXY_USER: ${PROXY_USER}
        PROXY_PASSWORD: ${PROXY_PASSWORD}
        PROXY_FQDN: ${PROXY_FQDN}
        PROXY_PORT: ${PROXY_PORT}
        NODE_ENV: production
    env_file:
      - ./prod/.env   
    container_name: ${UNIQUE_NAMESPACE}-webui-prod
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"
    # environment:
    #  - PROXY_PASSWORD='/run/secrets/proxy_password'
```
containers/app/sample.docker-compose.prod.yml

***Notice*** the difference in port number (dev: 8080, prod: 80) and overall size of the docker-compose files (dev: long, prod: short) between ***dev*** and ***prod***.

Copy the sample.docker-compose.prod.yml:

```
$ cp sample.docker-compose.prod.yml docker-compose.prod.yml
```

Let's also create a separate Dockerfile for use in production called ***Dockerfile.prod***:

```
ARG IMAGE_REPOSITORY
# development environment: pull official base image for node development
FROM ${IMAGE_REPOSITORY}/node:13.12.0-alpine as build

# See https://stackoverflow.com/questions/29261811/use-docker-compose-env-variable-in-dockerbuild-file
# ARG PROXY_USER
# ARG PROXY_PASSWORD
# ARG PROXY_FQDN
# ARG PROXY_PORT

# ENV HTTP_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"
# ENV HTTPS_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# build app
RUN npm run build

# production environment
FROM ${IMAGE_REPOSITORY}/nginx:stable-alpine

# install build
COPY --from=build /app/build /usr/share/nginx/html

# expose port
EXPOSE 80

# start app
CMD ["nginx", "-g", "daemon off;"]
```
containers/app/webui/Dockerfile.prod

Here, we take advantage of the [multistage build](https://docs.docker.com/engine/userguide/eng-image/multistage-build/) pattern to create a temporary image used for building the artifact – the production-ready React static files – that is then copied over to the production image. The temporary build image is discarded along with the original files and folders associated with the image. This produces a lean, production-ready image.

NOTE: Check out the [Builder pattern vs. Multi-stage builds in Docker](https://blog.alexellis.io/mutli-stage-docker-builds/) blog post for more info on multistage builds.

Before running docker-compose, make sure when on a Linux RHEL server, set enforcing to permissive, like so:

```
$ getenforce
$ Enforcing
$ sudo setenforce 0
$ getenforce
$ Permissive
```

Using the production docker-compose file, build and tag the Docker image, and run the container specifying its name as "pwc-cms-prod" to distinguish it from possible other stacks that are called "app" (the default name, based on the root directory):

```
$ cd containers/app
$ docker-compose --file docker-compose.prod.yml --project-name pwc-cmsgui-prod up --build -d
```

**Note**:   
```
-p, --project-name NAME     Specify an alternate project name
                              (default: directory name)
``` 

If successful, browse to http://localhost (***note***: 80 is the default port for HTTP, and therefore not required to be added to the hostname) to see the production version of the app.

![React App Screen Shot](react_app_screen_shot.png)

http://localhost:80 (you can leave the port number out, as 80 is the default)

If needed you can bring down the container as follows:

```
$ cd containers/app
$ docker-compose --file docker-compose.prod.yml stop
```
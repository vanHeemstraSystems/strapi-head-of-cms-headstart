# 100 - Project Setup

## 100 - Install Create React App globally

```
$ npm install -g create-react-app@3.4.1
```

NOTE: If you work from behind a proxy, read this if above throws an error that it cannot contact npm on the Web. https://medium.com/@ogbemudiatimothy/using-npm-install-behind-a-corporate-proxy-server-db150c128899

In short, go to command prompt or terminal depending on your machine(tip: hit Win + R and type cmd). In the command prompt type the following command 

```
$ npm config set proxy http://<username>:<password>@<proxy-server-url>:<port>
```

then 
 
 ```
 $ npm config set https-proxy http://<username>:<password>@<proxy-server-url>:<port>
 ``` 

- For username use: Your company account username (e.g. wheemstr)
- For password use: Your company account password
- For proxy server url use: Your company proxy server url
- For proxy port use: Your company proxy port

If your password contains special characters such as ```",@,:``` and so on, replace them by their URL encoded values. For example ```"```->```%22```, ```@```->```%40```, ```:```->```%3A```. ```%5C``` is used for the character ```\```.

Username and password really isn’t needed 9 times out of 10, the last 2 will suffice. Proxy-server-url is your address and your port is the port number. Once it’s set close command prompt and re-open it. And voila! you can now install all your packages.

## 200 - Setup the directory structure

For flexibility and maintenance of configuration let us first set up the directory structure.

Make a .gitignore file in the app directory: 

```
$ cd containers/app
$ touch .gitignore
```

Add the following content to the root of the project:

```
node_modules
```
.gitignore

Add a ***containers*** directory from the root of the project.

```
$ mkdir containers
```

Add an ***app*** directory from within the containers directory.

```
$ cd containers
$ mkdir app
```

Inside the app directory create a ***sample environment*** file.

```
$ cd app
$ touch sample.env
```

With the sample.env file created, add the following content to it:

```
UNIQUE_NAMESPACE=cmsgui
IMAGE_REPOSITORY=+++++ your image repository, e.g. dockerhub +++++
PROXY_USER=+++++ your proxy user +++++
PROXY_PASSWORD=+++++ set value in secrets/proxy_password +++++
PROXY_FQDN=+++++ your proxy server fully qualified domain name +++++ 
PROXY_PORT=+++++ your proxy port +++++
```
containers/app/sample.env

Inside the app directory create a ***sample.docker-compose.dev.yml*** file.

```
$ cd app
$ touch sample.docker-compose.dev.yml
```

With the sample.docker-compose.dev.yml file created, add the following content to it:

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
      dockerfile: Dockerfile.dev
      args: # from env_file
        UNIQUE_NAMESPACE: ${UNIQUE_NAMESPACE}
        IMAGE_REPOSITORY: ${IMAGE_REPOSITORY}
        PROXY_USER: ${PROXY_USER}
        # PROXY_PASSWORD: ${PROXY_PASSWORD}
        PROXY_FQDN: ${PROXY_FQDN}
        PROXY_PORT: ${PROXY_PORT}
        NODE_ENV: development
    env_file:
      - .env
    container_name: ${UNIQUE_NAMESPACE}-webui-dev
    security_opt:
      - no-new-privileges:true
    ports:
      - "8080:3000"
    volumes:
      - ./webui:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPULLING=true
    #  - PROXY_PASSWORD='/run/secrets/proxy_password'
```
containers/app/sample.docker-compose.dev.yml

## 300 - Generate a new app

Inside the subdirectory /containers/app/ created a new app called '***webui***':

```
$ cd containers/app
$ npm init react-app webui --use-npm
$ cd webui
```

You will be prompted as follows:

```
found 27 vulnerabilities (8 moderate, 18 high, 1 critical)
  run `npm audit fix` to fix them, or `npm audit` for details

Success! Created webui at H:\git\pwc-content-management-systems\containers\app\webui
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd webui
  npm start

Happy hacking!
```

Take care of the reported vulnerabilities by running the following command from within the webui directory.

```
$ cd webui
$ npm audit fix
```

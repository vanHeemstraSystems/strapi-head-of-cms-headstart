# 100 - Service Setup

## 100 - Install Create React App globally

Not applicable.

## 200 - Setup the directory structure

Inside te ```app``` directory create a new directory called ```cms```.

```
$ cd containers/app
$ mkdir cms
```

## 300 - Generate a new app

Inside the newly created ```cms``` directory run the following command:

```
$ cd containers/app/cms
$ yarn add next@9.4.0 react@16.13.1 react-dom@16.13.1
```

***Note***: I am using ```yarn``` as my package manager, you can also use npm and execute ```npm install next@9.4.0 react@16.13.1 react-dom@16.13.1```. yarn and npm are interchangeable.

Add the following to your package.json file after your dependencies:

```
...
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
...
```
containers/app/cms/package.json

So that your file looks like this:

```
{
  "dependencies": {
    "next": "9.4.0",
    "react": "16.13.1",
    "react-dom": "16.13.1"
  },
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```
containers/app/cms/package.json

Be sure to create a ```.gitignore``` in the ```cms``` directory and add .next and node_modules directories to it:

```
$ cd containers/app/cms
$ touch .gitignore
```

```
node_modules
.next
```
containers/app/cms/.gitignore

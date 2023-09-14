<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



## Installation
#### Se requiere configurar el archivo __dev.env__ para ejecutar en desarrollo (seguir formato de .env.template)
```bash
yarn install
```
```
npm i -g @nestjs/cli
```
```
 docker compose up -d
```
## Construir base de datos con la semilla
```
http://localhost:3000/api/v1/seed
```
## Running the app

```bash

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test
### Se requiere configurar el archivo __e2e.env__ para los test de integracion
```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Stack used
Nest 
MongoDB


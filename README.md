# open-ir-api

IR api for beatoraja

## require

- mariadb

- node v14.15.4

- memcached

for session.

## installation

`yarn install`

## migration

`npm run migrate-init` all reset.

`npm run migrate` only additional.

## docker

1. `docker-compose up`
2. `docker-compose exec node sh`
3. `npm run migrate`
4. `node index.js`
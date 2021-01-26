# open-ir-api

IR api for beatoraja

## require

- mariadb

- node v14.15.4

- memcached

## installation

`yarn install`

## migration

`npm run migrate-init` all reset.

`npm run migrate` only additional.

## Running

`npm run start`

`npm run start-watch` for development.

## docker

1. `docker-compose up`

If you need manually migration.

2. `docker-compose exec node sh`
3. `npm run migrate-init` or `npm run migrate`
4. `npm run start` or `npm run start-watch`

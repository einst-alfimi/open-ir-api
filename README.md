# open-ir-api

IR api for beatoraja

## require

- mariadb

- Node

node v14.15.4

sequelize-cli

- memcached

for session.

## migration

`npm run migrate`

all reset.

## docker

1. `docker-compose up`
2. `docker-compose exec node sh`
3. `npm run migrate`
4. `node index.js`
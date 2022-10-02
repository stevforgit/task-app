## Description

Tode app is a simple task manager that allow you to keet track of your day to day tasks.
This project is build using Nestjs framework, GraphQL & Prisma ORM with PostgreSQL.

## Installation
# 1. Install dotenv-cli
```bash
 $ npm install -g dotenv-cli
```

#  2. Install project dependencies
```bash
 $ npm install
```

#  3. Run PostgreSQL in docker container
```bash
 $ docker compose up
```

#  4.  Run database migration
```bash
 $ npm run migrate:dev
```

#  5.  Start app server
```bash
 $ npm run start
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```
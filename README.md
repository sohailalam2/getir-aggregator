# Aggregator API Service

![Build & Test](https://github.com/sohailalam2/g-aggregator/workflows/Build%20&%20Test/badge.svg?branch=master)

## Description

This is an awesome aggregator service for a demo database. It uses [Nest](https://github.com/nestjs/nest) framework, with Express behind the scene and Typescript to achieve amazing task.

## Installation

```bash
$ npm install
```

## Setup

Before starting the application, create an `.env` file to pass the following configurations.

PORT is optional and will default to 3000

MONGODB_URI is required. This can be a single mongodb host url or a srv record.

```env
PORT=8080

MONGODB_URI=mongodb+srv://<username>:<password>@<host>/<db>?retryWrites=true
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Test coverage is excellent as can be seen below:

```
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |      75 |    33.33 |   81.25 |   74.67 |
 src                         |    96.3 |      100 |     100 |   95.45 |
  app.controller.ts          |   92.86 |      100 |     100 |   91.67 | 54
  app.service.ts             |     100 |      100 |     100 |     100 |
 src/dto                     |    87.5 |      100 |       0 |    87.5 |
  data-request.dto.ts        |   81.82 |      100 |       0 |   81.82 | 24,29
  data-response.dto.ts       |     100 |      100 |     100 |     100 |
  health.dto.ts              |     100 |      100 |     100 |     100 |
  index.ts                   |     100 |      100 |     100 |     100 |
 src/schema                  |     100 |      100 |     100 |     100 |
  index.ts                   |     100 |      100 |     100 |     100 |
  records.schema.ts          |     100 |      100 |     100 |     100 |
 src/utils                   |   41.94 |    33.33 |   85.71 |   44.83 |
  http-exception.filter.ts   |       0 |        0 |       0 |       0 | 1-44
  is-less-than.validator.ts  |     100 |      100 |     100 |     100 |
  is-only-date.validation.ts |     100 |      100 |     100 |     100 |
-----------------------------|---------|----------|---------|---------|-------------------
```

## CICD

This project also supports end-to-end CICD solution and the live server is deployed on Heroku

![CICD Pipeline](./.github/workflows/cicd.png)

## API

A live demo version of the application is deployed in Heroku at the following hostname:

**https://morning-refuge-36684.herokuapp.com**

### Health Endpoint

> GET /health

*Request*

```bash
curl --location --request GET 'localhost:8080/health'
```

*Response*

```json
{
    "name": "getir-aggregator",
    "version": "0.0.1",
    "status": "OK"
}
```

### Data Endpoint

> POST /data

*Request*

```bash
curl --location --request POST 'localhost:8080/data' \
--header 'Content-Type: application/json' \
--data-raw '{
    "startDate": "2016-01-26",
    "endDate": "2018-02-02",
    "minCount": 2900,
    "maxCount": 2910
}'
```

*Response*

```json
{
    "code": 0,
    "msg": "success",
    "records": [
        {
            "createdAt": "2016-12-13T18:58:33.864Z",
            "key": "XCiSazeS",
            "totalCount": 2906
        },
        {
            "createdAt": "2016-03-17T11:07:46.355Z",
            "key": "rwghjfLQ",
            "totalCount": 2907
        }
    ]
}
```

## License

Nest is [MIT licensed](LICENSE) and so is this application :)

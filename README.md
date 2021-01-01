# Getir Aggregator

![Build & Test](https://github.com/sohailalam2/getir-aggregator/workflows/Build%20&%20Test/badge.svg?branch=master)

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

## API

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

# Getir Aggregator

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

## License

Nest is [MIT licensed](LICENSE) and so is this application :)

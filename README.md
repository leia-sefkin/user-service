# user-microservice

## Installation

 `npm install`
 
[Dotenv](https://www.npmjs.com/package/dotenv) is used to load environment variables from a .env file at runtime onto process.env. Alternatively you can load these manually.
 
 Current required variables:
 ```
 PORT - the port for the server to run on, defaults to 3000 if not set.
 DATABASE_URL - the url of the mongo database. 
 ```
 
Built and tested with:
- NodeJS v13.6.0
- MongoDB 4+

The code makes use of various ES6 features including Promises and async.  

## Running The App

This app runs on Express with Mongoose. [nodemon](https://www.npmjs.com/package/nodemon) process manager will keep the process running and auto-restart on file change. 

From the root of the project run the following command:
 `npm run start`

## Test
Test models and routes using mocha, chai and supertest. An 

From the root of the project

  `npm run test`

# Usage

## POST /users

# user-service

## Installation

 `npm install`
 
[Dotenv](https://www.npmjs.com/package/dotenv) is used to load environment variables from a .env file at runtime onto process.env. There is an example .env file included with the repository, please set the variables according to your configuration. Alternatively you can load these manually.
 
 Current required variables:
 ```
 PORT - the port for the server to run on, defaults to 3000 if not set.
 DATABASE_URL - the url of the mongo database. 
 TEST_DATABASE_URL - the url of the test mongo db. 
 ```
 
Built and tested with:
- NodeJS v13.6.0
- MongoDB 4+

The code makes use of various ES6 features including Promises and async.  

## Running The App

This app runs on Express with Mongoose. [nodemon](https://www.npmjs.com/package/nodemon) process manager will keep the process running and auto-restart on file change. 

The following scripts are configured in pacakage.json

From the root of the project run the following command:
 `npm run dev` or `npm run prod` - runs the app for a development or production environment
 `npm run test` - runs the mocha test suite
 `npm run coverage` - generates a code coverage report using the nyc module

The code coverage command will run through the mocha tests and generate a report in the console as well as an html version loadable in browser under `/coverage/index.html`

Prometheus is configured for tracking route response times using the express-prom-bundle module. You can view metrics at `localhost:3000/metrics` and graphs through a running Prometheus instance. Be sure to load your prometheus with the config file located at `/prometheus-data/prometheus.yml`

# Usage

## POST /users

This endpoint will create a new user or group of users. The request body should be an array of user objects in the following format (all fields required, and user_id must be unique): 

```
{
  user_id: number,
  first_name: string,
  last_name: string,
  zip_code: number,
  email_address: string
}

```

Response: Returns 200 Success 

## GET /users/:id

Use this endpoint to query a user by id. 

Response: Returns the user document found or 404.

## GET /users

Use this endpoint to query for all users in the system. 

Response: Returns an array of user documents.

## PUT /users/:id

Use this endpoint to update a user by id. Will only update the fields passed.

Example request:

```
curl -X PUT -H "Content-Type: application/json" -d '{
  "first_name": "Bella",
  "last_name" : "Squiggs",
}' http://localhost:3000/users/123456
```
Response: Returns success on update.

## PUT /users

Use this endpoint to update multiple users at once. Will only update the fields passed in, each object must contain the field user_id in order to identify the user associated.

```
curl -X PUT -H "Content-Type: application/json" -d '[{
  "user_id": 123456,
  "first_name": "Bella",
  "last_name" : "Squiggs",
},{
  "user_id": 345678,
  "email": "mailo@dog.de",
  "zip_code": "23451",
}]' http://localhost:3000/users
```

## DELETE /users/:id

Use this endpoint to delete a user by id. 

Returns: Success on deletion. 


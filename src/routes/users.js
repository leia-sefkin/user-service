const express = require('express');

let router = express.Router();
const User = require('../models/user');
const logger = require('../util').logger;

/*
  Create a new user using the object posted to the request body, all fields are required

  @param req.body {Object} required - the user to create
  @param req.body.user_id {Number} required - user's ID, must be unique
  @param req.body.first_name {String} required - user's first name
  @param req.body.last_name {String} required - user's last name
  @param req.body.zip_code {Number} required - user's zip code
  @param req.body.email_address {String} required - user's email address

  Returns newly created user doc
*/
router.post('/users', function(req, res, next) {
  const user = req.body;
  logger.info(`Creating new user: ${user}`);

  return User.create({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    zip_code: user.zip_code,
    email_address: user.email_address
  }).then((user) => {
    return res.status(200).send(user);
  }).catch(next);

});

/* 
  Retrieve a user by ID

  @param req.params.id {Number} required - the user ID to search for

  Returns the user found or a 404 if not found
*/
router.get('/users/:id', function(req, res, next) {
  const userId = req.params.id;
  logger.info(`Looking up user by ID: ${userId}`);

  return User.find({
    user_id: userId
  }).then((user) => {
    if (user.length < 1) {
      logger.error(`Requested user: ${userId} not found in DB.`);
      return res.status(404).send('User not found');
    }

    return res.status(200).send(user[0]);
  }).catch(next);

});

/* 
  Retrieve a list of all users
*/
router.get('/users', function(req, res, next) {
  logger.info('Listing all users.');

  return User.find().then((users) => {
    return res.status(200).send(users);
  }).catch(next);

});

/*
  Update fields on the user object
  The only field we won't update is user_id 

  @param req.params.id {Number} required - the user ID to update
  @param req.body.first_name {String} optional - user's first name
  @param req.body.last_name {String} optional - user's last name
  @param req.body.zip_code {Number} optional - user's zip code
  @param req.body.email_address {String} optional - user's email address

  Returns updated user object
*/
router.put('/users/:id', function(req, res, next) {
  const userId = req.params.id;
  const newInfo = req.body;
  logger.info(`Updating user ${userId} with info: ${newInfo}`);

  //Check that the fields exist before trying to update
  let updated = {};
  if (newInfo.first_name) {
    updated.first_name = newInfo.first_name;
  }

  if (newInfo.last_name) {
    updated.last_name = newInfo.last_name;
  }

  if (newInfo.zip_code) {
    updated.zip_code = newInfo.zip_code;
  }

  if (newInfo.email_address) {
    updated.email_address = newInfo.email_address;
  }

  return User.findOneAndUpdate({
    user_id: userId
  },
  updated,
  {
    //Mongoose setting to return modified doc rather than original
    new: true
  }).then((user) => {
    if (user.length < 1) {
      logger.error(`Requested user to update: ${userId} not found in DB.`);
      return res.status(404).send('User not found');
    }

    return res.status(200).send(user);
  }).catch(next);

});

/* 
  Delete a user by ID

  @param req.params.id {Number} required - the user ID to search for

  Returns success on deletion
*/
router.delete('/users/:id', function(req, res, next) {
  const userId = req.params.id;
  logger.info(`Deleting user by ID: ${userId}`);

  return User.findOneAndRemove({
    user_id: userId
  }).then(() => {
    return res.status(200).send('User Deleted');
  }).catch(next);

});

module.exports = router;
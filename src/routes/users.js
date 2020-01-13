const express = require('express');

let router = express.Router();
const User = require('../models/user');
const logger = require('../util').logger;

/*
  Create new user(s)
    expects and array of user objects on the request body
    all fields are required

  @param req.body {[Object]} required - the user to create
  @param req.body.user_id {Number} required - user's ID, must be unique
  @param req.body.first_name {String} required - user's first name
  @param req.body.last_name {String} required - user's last name
  @param req.body.zip_code {Number} required - user's zip code
  @param req.body.email_address {String} required - user's email address

  Returns success on creation
*/
router.post('/users', function(req, res) {
  const users = req.body;

  //loop through users and make sure they're formatted correctly
  users.map(function(user) {
    return {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      zip_code: user.zip_code,
      email_address: user.email_address
    };
  });

  User.insertMany(users, function(err, users) {
     if (err) {
      logger.error(`Error while creating users. message: ${err.message}`);
      return res.status(500).send('Server issue');
    }

    logger.info(`Created new users: ${users}`);
    return res.status(200).send('success');
  });

});

/* 
  Retrieve a user by ID

  @param req.params.id {Number} required - the user ID to search for

  Returns the user found or a 404 if not found
*/
router.get('/users/:id', function(req, res) {
  const userId = req.params.id;
  logger.info(`Looking up user by ID: ${userId}`);

  User.findOne({
    user_id: userId
  }, function(err, user) {

    if (err) {
      logger.error(`Error while reading user ID: ${userId} message: ${err.message}`);
      return res.status(500).send('Server issue');
    }

    if (!user) {
      logger.error(`Requested user: ${userId} not found in DB.`);
      return res.status(404).send('User not found');
    }

    logger.info(`Found user ID: ${user.user_id}`);

    return res.status(200).send(user);
  });

});

/* 
  Retrieve a list of all users
*/
router.get('/users', function(req, res) {
  logger.info('Listing all users.');

  User.find({}, function(err, users) {

    if (err) {
      logger.error(`Error while listing all users: ${err.message}`);
      return res.status(500).send('Server issue');
    }

    return res.status(200).send(users);
  });

});

/*
  Update fields on the user document
  The only field we won't update is user_id 

  @param userId {Number} required - the user ID to update
  @param user.first_name {String} optional - user's first name
  @param user.last_name {String} optional - user's last name
  @param user.zip_code {Number} optional - user's zip code
  @param user.email_address {String} optional - user's email address

  Returns updated user object
*/
async function updateUserRecord(userId, user) {
  logger.info(`Updating user ID: ${userId}`);

  //only copy over fields we want to update
  let updates = {};

  if (user.first_name) {
    updates.first_name = user.first_name;
  }

  if (user.last_name) {
    updates.last_name = user.last_name;
  }

  if (user.zip_code) {
    updates.zip_code = user.zip_code;
  }

  if (user.email_address) {
    updates.email_address = user.email_address;
  }

  return await User.findOneAndUpdate({
    user_id: userId
    },
      updates,
    {
      //Mongoose setting to return modified doc rather than original
      new: true
    });
};

/*
  Update fields on the user object
  The only field we won't update is user_id 

  @param req.params.id {Number} required - the user ID to update
  @param req.body.first_name {String} optional - user's first name
  @param req.body.last_name {String} optional - user's last name
  @param req.body.zip_code {Number} optional - user's zip code
  @param req.body.email_address {String} optional - user's email address

  Returns success on update
*/
router.put('/users/:id', function(req, res) {
  const userId = req.params.id;
  const updates = req.body;

  updateUserRecord(userId, updates).then((result) => {
    logger.info(`updated user ID: ${userId} result: ${result}`);

    if (!result) {
      logger.error(`Requested user to update: ${userId} not found in DB.`);
      return res.status(404).send('User not found');
    }

    return res.status(200).send('Success');
  })
  .catch((err) => {
    logger.error(`Error while updating user ID: ${userId} message: ${err.stack}`);
    return res.status(500).send('Server issue');
  });
    
});

/*
  Update multiple users 
    Accepts an array of user objects to update

  @param req.body {[Object]} required - the array of user updates
*/
router.put('/users', function(req, res) {
  const users = req.body;
  logger.info('Updating an array of user docs');

  Promise.all(users.map((user) => {
    return updateUserRecord(user.user_id, user);

  })).then(updates => {
    logger.info(`Made updates to users, result: ${updates}`);

    return res.status(200).send('Success');
  }).catch(err => {
    logger.error(`error while making updates ${err.stack}`);
    return res.status(500).send('Server issue');
  });
});

/* 
  Delete a user by ID

  @param req.params.id {Number} required - the user ID to search for

  Returns success on deletion
*/
router.delete('/users/:id', function(req, res) {
  const userId = req.params.id;
  logger.info(`Deleting user by ID: ${userId}`);

  User.findOneAndRemove({
    user_id: userId
  }, {}, function(err) {
    if (err) {
      logger.error(`Error while deleting user ID: ${userId} message: ${err.message}`);
      return res.status(500).send('Server issue');
    }

    return res.status(200).send('User Deleted');
  });

});

module.exports = router;
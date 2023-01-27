const express = require('express');
const router = express.Router();
const { signup, login, user, followers, following, follow, unfollow } = require('../controller/index');
const { requiresignin } = require('../middlewares');
const { isRequestValidated, validateSignupRequest, validateSigninRequest } = require('../validations');

//route for creating a new user account
router.post('/users', validateSignupRequest, isRequestValidated, signup);

//route for authenticating and logging in a user
router.post('/login', validateSigninRequest, isRequestValidated, login);

//route for retrieving a specific user by username
router.get('/users/:username', requiresignin, user);

//route for retrieving a list of followers for a specific user
router.get('/users/:username/followers', requiresignin, followers);

//route for retrieving a list of users a specific user is following
router.get('/users/:username/following', requiresignin, following);

//route for following a specific user
router.post('/users/:username/follow', requiresignin, follow);

//route for unfollowing a specific user
router.delete('/users/:username/follow', requiresignin, unfollow);

module.exports = router;
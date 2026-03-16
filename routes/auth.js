const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', [check('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .custom(value => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject(
            'E-Mail exists already, please pick a different one.'
          );
        }
      });
    }), 
    check('password')
    .isLength({ min: 5 })
    .withMessage('Please enter a password with at least 5 characters.')
    .isAlphanumeric()
    .withMessage('Please enter a password with only letters and numbers.')
    .trim(),
    check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('Passwords have to match!')
    .trim()
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);  
 
module.exports = router;
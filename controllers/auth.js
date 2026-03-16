const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS
  }
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg
    });
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      transporter.sendMail({
        from: 'matissj1337@gmail.com',
        to: email,
        subject: 'Welcome to our app',
        text: 'Welcome to our app. Please login to continue.',
        html: '<p>Welcome to our app. Please login to continue.</p>'
      }).catch(err => {
        console.log(err);
      });
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/signup');
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buf) => {
    if (err) {
        console.log(err);
        return res.redirect('/reset');
    }
    const token = buf.toString('hex');
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
    })
    .then(result => {
        transporter.sendMail({
            from: 'matissj1337@gmail.com',
            to: req.body.email,
            subject: 'Reset Password',
            text: 'Reset Password',
            html: `<p>Reset your password by clicking <a href="http://localhost:3000/reset/${token}">this link</a>.</p>`
        }).catch(err => {
            console.log(err);
        });
        res.redirect('/login');
    }).catch(err => {
        console.log(err);
        res.redirect('/reset');
    });
});
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/reset');
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/reset');
    });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({ _id: userId, resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/reset');
        }
        return bcrypt.hash(newPassword, 12)
        .then(hashedPassword => {
            resetUser = user;
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        }).then(result => {
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
            res.redirect('/reset');
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/reset');
    });
};
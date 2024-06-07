const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Display Sign Up form on GET
exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form");
});

// Handle Sign Up on POST
exports.sign_up_post = [
  // Validate and sanitize fields
  body("username", "Username must not be longer than 3 characters")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error("This username already exist");
      }
    })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "Password must be at least 6 characters long")
    .isLength({ min: 6 })
    .escape(),
  body("confirm-password").custom((value, { req }) => {
    return (value = req.body.password);
  }),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        title: 'Sign Up',
        user: req.body,
        errors: errors.array()
      });
      console.log('Sign up Failed');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        membership_status: false,
        is_admin: false,
      });
      await user.save();

      req.login(user, (err) => {
        if (err) {
          console.log(err);
          res.redirect('/sign-up');
        }
        console.log('Logged In:' + user);
        return res.redirect('/');
      });
      
    } catch (err) {
      return next(err);
    }
  }),
];

// GET login form
exports.log_in_get = asyncHandler(async (req, res, next) => {
  res.render("log-in-form", { user: req.user });
});

// POST request to login
exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

// GET log out
exports.log_out_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

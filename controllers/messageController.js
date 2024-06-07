const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

/*
TODO:
- Edit existing message (Validate Form)
- Delete existing message (Admin Only, Validate Form)
- Members can only see author of message
*/

// Display Home page on GET
exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate('user');

  res.render("index", { title: "Home", user: req.user, messages: messages });
});

exports.join_club_get = asyncHandler(async (req, res, next) => {
  res.render("join-club", { title: "Join the Club", user: req.user });
});

exports.join_club_post = [
  // Validate and sanitize fields
  body("username")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (!existingUser) {
        throw new Error("This username does not exist");
      }
    })
    .trim()
    .escape(),
  body("secretCode").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("join-club", {
        title: "Join the Club",
        user: req.body,
        errors: errors.array(),
      });
      console.log("Secret Code failed");
      return;
    }

    try {
      if (process.env.SECRET_CODE === req.body.secretCode) {
        const user = await User.findOneAndUpdate(
          { username: req.body.username },
          { membership_status: true },
          { new: true }
        );

        console.log(
          `${user.username} Member Status: ${user.membership_status}`
        );

        res.redirect("/");
      }
    } catch (err) {
      return next(err);
    }
  }),
];

exports.create_message_get = asyncHandler(async (req, res, next) => {
  res.render("create-message-form", { title: "Create Message" });
});

exports.create_message_post = [
  body("new-message")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Message cannot be empty"),
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title for message cannot be empty"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("create-message-form", {
        title: "Create Message",
        user: req.user,
        errors: errors.array(),
      });
      return;
    }

    const message = new Message({
      user: req.user._id,
      title: req.body.title,
      post_date: Date(),
      text: req.body["new-message"],
    });

    await message.save();

    res.redirect("/");
  }),
];

exports.edit_message = asyncHandler(async (req, res, next) => {});

exports.delete_message = asyncHandler(async (req, res, next) => {});

const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

/*
TODO:
- Edit existing message (Validate Form) - Edit Own Message
*/

// Display Home page on GET
exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate("user");
  if (req.user === undefined) {
    console.log('Not');
  } else {
    console.log(req.user._id);
  }
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
  res.render("message-form", { title: "Create Message" });
});

exports.create_message_post = [
  body("message")
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
      res.render("message-form", {
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
      text: req.body.message,
    });

    await message.save();

    res.redirect("/");
  }),
];

exports.edit_message_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate('user').exec();
  console.log('Received ID:', req.params.id);

  if (!message == null) {
    console.log("Message not found");
    const err = new Error("Message not found");
    err.status = 404;
    return next(err);
  }

  res.render("message-form", {
    title: "Edit Message",
    message: message,
  });
});

exports.edit_message_post = [
  body("message")
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

    const editedMessage = {
      title: req.body.title,
      post_date: Date(),
      text: req.body.message,
    };

    if (!errors.isEmpty()) {

      res.render("message-form", {
        title: "Edit Message",
        message: editedMessage,
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      await Message.findByIdAndUpdate(req.params.id, editedMessage, { new: true });
      res.redirect(`/`);
    }
  }),
];

exports.delete_message_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (message === null) {
    res.redirect("/");
  }

  res.render("delete-message", {
    title: "Delete Message",
    message: message,
  });
});

exports.delete_message_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.messageId);
  res.redirect("/");
});

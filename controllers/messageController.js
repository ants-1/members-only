const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

    if(!errors.isEmpty()) {
        res.render("join-club", {
            title: "Join the Club",
            user: req.body,
            errors: errors.array()
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
      
            console.log(`${user.username} Member Status: ${user.membership_status}`);
      
            res.redirect("/");
          }
    } catch(err) {
        return next(err);
    }
  }),
];

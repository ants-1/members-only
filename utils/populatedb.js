#!/usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Message = require("../models/message");
const User = require("../models/user");

const messages = [];
const users = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");

  await createUsers();
  await createMessages(users);

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createUser(
  index,
  username,
  password,
  membership_status,
  is_admin,
  date_joined
) {
  const userDetails = {
    username: username,
    password: password,
    membership_status: membership_status,
    is_admin: is_admin,
    date_joined: date_joined,
  };

  const user = new User(userDetails);

  await user.save();
  users[index] = user;
  console.log(`Added user: ${user}`);
}

async function createMessage(index, user, title, post_date, text) {
  const messageDetails = {
    user: user,
    title: title,
    post_date: post_date,
    text: text,
  };

  const message = new Message(messageDetails);

  await message.save();
  messages[index] = message;
  console.log(`Added message: ${message}`);
}

async function createUsers() {
  console.log("Adding users");
  await Promise.all([
    createUser(0, "john123", "123", true, true, "10/05/24"),
    createUser(1, "max123", "123", true, true, "10/05/24"),
  ]);
}

async function createMessages(users) {
  console.log("Adding messages");
  await Promise.all([
    createMessage(
      0,
      users[0]._id,
      "Welcome Message",
      "10/05/24",
      "Hello, nice to meet you."
    ),
    createMessage(
      1,
      users[1]._id,
      'Replay to "Welcome Message"',
      "11/05/24",
      "Hey"
    ),
  ]);
}

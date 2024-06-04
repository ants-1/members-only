const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true, maxLength: 150 },
    membership_status: { type: Boolean, required: true },
    is_admin: { type: Boolean, required: true },
    date_joined: { type: Date, default: Date.now },
})

// Virtual for User's URL
UserSchema.virtual('url').get(function () {
    return `/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);
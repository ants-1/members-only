const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxLength: 100 },
    post_date: { type: Date, required: true },
    text: { type: String, required: true}
});

module.exports = mongoose.model("Message", MessageSchema);
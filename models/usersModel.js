const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
  },
  { versionKey: false }
);

const users = mongoose.model(
  'users',
  usersSchema
);

module.exports = users;
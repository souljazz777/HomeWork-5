const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    image: {
      type:String,
      default:""
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false 
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:"users",
        required: [true, '貼文 ID 未填寫']
    },
    likes: {
        type:Number,
        default:0
      }
  },
  { versionKey: false }
);

const posts = mongoose.model(
  'posts',
  postsSchema
);

module.exports = posts;
/** @format */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const CommentModel = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Yeu cau nhap noi dung'],
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
    post: {
      type: Schema.Types.ObjectId,
      required: [true, 'Thieu id post'],
      ref: 'Post',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taggedPeople: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default model('Comment', CommentModel);

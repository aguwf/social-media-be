/** @format */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const PostModel = new Schema(
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
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    shares: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    location: {
      type: String,
    },
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

export default model('Post', PostModel);

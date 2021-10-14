/** @format */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const UserModel = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Yeu cau nhap fullname'],
      trim: true,
      maxLength: 25,
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
    },
    cover: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    savedPost: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: [true, 'role required'],
    },
    gender: {
      type: String,
      enum: ['Nam', 'Nu'],
      default: 'Nam',
    },
    tel: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    birthday: {
      type: Date,
      default: Date.now(),
    },
    story: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'account id required!'],
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default model('User', UserModel);

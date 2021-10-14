/** @format */

'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const model = mongoose.model;

const AccountModel = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Yeu cau nhap username'],
    },
    password: {
      type: String,
      required: [true, 'Yeu cau nhap mat khau'],
    },
    email: {
      type: String,
      required: [true, 'Yeu cau nhap email'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

AccountModel.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return error;
  }
};

export default model('Account', AccountModel);

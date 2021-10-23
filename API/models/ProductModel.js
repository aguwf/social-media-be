/** @format */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const ProductModel = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Yeu cau nhap ten ca phe'],
    },
    price: {
      type: Number,
      required: [true, 'Yeu cau nhap gia ca phe'],
    },
    overview_image: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
    },
    brand: {
      type: String,
    },
    taste: {
      type: String,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
    information: {
      type: String,
    },
    nutrition: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default model('Product', ProductModel);

/** @format */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const CategoryModel = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Yeu cau nhap ten danh muc'],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    overview_image: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default model('Category', CategoryModel);

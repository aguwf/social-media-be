/** @format */

import Post from '../models/PostModel.js';
import Comment from '../models/CommentModel.js';
import User from '../models/UserModel.js';
import Category from '../models/CategoryModel.js';
import Product from '../models/ProductModel.js';

export const categoryHandle = {
  getListCategory: async (req, res) => {
    try {
      const listCategory = await Category.find({ isValid: true })
        .select({ name: 1, overview_image: 1 })
        .populate([
          {
            path: 'overview_image',
          },
        ]);

      res.status(200).json({ msg: 'Success', listCategory });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getDetailCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const detailCategory = await Category.findById({
        _id: id,
        isValid: true,
      }).populate([
        {
          path: 'products',
          populate: [
            {
              path: 'images',
            },
            {
              path: 'overview_image',
            },
          ],
        },
        {
          path: 'overview_image',
        },
      ]);
      console.log(
        '🚀 ~ file: CategoryHandle.js ~ line 29 ~ detailCategory',
        detailCategory,
      );

      res.status(200).json({ msg: 'Success', detailCategory });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  addCategory: async (req, res) => {
    try {
      const newCategory = {
        ...req.body,
      };

      await Category.create(newCategory);

      const listCategory = await Category.find({ isValid: true })
        .select({ name: 1, overview_image: 1 })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'overview_image',
          },
        ]);

      res.status(201).json({ msg: 'Create category success !', listCategory });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      let newProducts, deleteProducts;

      function difference(arr1 = [], oar2 = []) {
        return arr1.reduce((t, v) => (!oar2.includes(v) && t.push(v), t), []);
      }

      const oldCategories = await Category.findByIdAndUpdate(
        { _id: id, isValid: true },
        req.body,
      );

      if (req.body.products) {
        newProducts = difference(req.body.products, oldCategories.products);

        deleteProducts = difference(oldCategories.products, req.body.products);

        await Product.findByIdAndUpdate(
          { _id: { $in: newProducts } },
          { $push: { categories: { $each: [oldCategories._id] } } },
          { new: true },
        );

        await Product.findByIdAndUpdate(
          { _id: { $in: deleteProducts } },
          { $pull: { categories: { $each: [oldCategories._id] } } },
          { new: true },
        );
      }

      const listCategory = await Category.find({ isValid: true })
        .select({ name: 1, overview_image: 1 })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'overview_image',
          },
        ]);

      res.status(200).json({ msg: 'Update success !', listCategory });

      // await Category.findByIdAndUpdate(
      //   { _id: id, isValid: true },
      //   {
      //     $push: {
      //       products: {
      //         $each: products,
      //       },
      //     },
      //   },
      //   { new: true },
      // );

      // const listProduct = await Product.findById({ _id: { $in: products } });
      // console.log(
      //   '🚀 ~ file: CategoryHandle.js ~ line 105 ~ listProduct',
      //   listProduct,
      // );

      // products.forEach((product) => {
      //   await Product.findByIdAndUpdate();
      // });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const patchPost = await Post.findByIdAndDelete(id);
      await User.findByIdAndUpdate(
        { _id: req.user.id, isValid: true },
        {
          $pull: {
            posts: id,
          },
        },
      );
      res.status(200).json({ msg: 'Delete post success !', listPost });
    } catch (error) {
      console.log(
        '🚀 ~ file: CategoryHandle.js ~ line 131 ~ deleteCategory: ~ error',
        error,
      );
      return res.status(500).json({ error: error.message });
    }
  },
  uploadImageCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const overview_image = req.files[0];
    } catch (error) {
      console.log(
        '🚀 ~ file: CategoryHandle.js ~ line 138 ~ uploadImageCategory:async ~ error',
        error,
      );
      return res.status(500).json({ error: error.message });
    }
  },
};

/** @format */

import Post from '../models/PostModel.js';
import Comment from '../models/CommentModel.js';
import User from '../models/UserModel.js';
import Category from '../models/CategoryModel.js';
import Product from '../models/ProductModel.js';

export const productHandle = {
  getListProduct: async (req, res) => {
    try {
      const listProduct = await Product.find({ isValid: true })
        .select({ name: 1, overview_image: 1, price: 1 })
        .populate([
          {
            path: 'overview_image',
          },
        ]);

      res.status(200).json({ msg: 'Success', listProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getDetailProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const detailProduct = await Product.findById({
        id,
        isValid: true,
      }).populate([
        {
          path: 'categories',
        },
        {
          path: 'images',
        },
        {
          path: 'overview_image',
        },
        {
          path: 'owner',
        },
      ]);

      res.status(200).json({ msg: 'Success', detailProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  addProduct: async (req, res) => {
    try {
      const { id } = req.user;
      const newProduct = {
        ...req.body,
        owner: id,
      };

      const savedProduct = await Product.create(newProduct);

      if (req.body.categories.length > 0) {
        req.body.categories.forEach(async (category) => {
          await Category.findByIdAndUpdate(
            { _id: category },
            {
              $push: { products: { $each: [savedProduct._id] } },
            },
          );
        });
      }

      const listProduct = await Product.find({ isValid: true })
        .select({ name: 1, overview_image: 1, price: 1 })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'categories',
          },
          {
            path: 'images',
          },
          {
            path: 'overview_image',
          },
          {
            path: 'owner',
          },
        ]);

      res.status(201).json({ msg: 'Create product success !', listProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      let newCategories, deleteCategories;
      function difference(arr1, oar2) {
        return arr1.reduce((t, v) => (!oar2.includes(v) && t.push(v), t), []);
      }

      const oldProducts = await Product.findByIdAndUpdate(
        { _id: id, isValid: true },
        req.body,
      );

      if (req.body.categories) {
        newCategories = difference(req.body.categories, oldProducts.categories);

        deleteCategories = difference(
          oldProducts.categories,
          req.body.categories,
        );

        Category.findByIdAndUpdate(
          { _id: { $in: newCategories } },
          { $push: { products: { $each: [oldProducts._id] } } },
          { new: true },
        );

        Category.findByIdAndUpdate(
          { _id: { $in: deleteCategories } },
          { $pull: { products: { $each: [oldProducts._id] } } },
          { new: true },
        );
      }

      console.log(
        '🚀 ~ file: ProductHandle.js ~ line 89 ~ updateProduct: ~ newCategories, updateCategories, deleteCategories',
        newCategories,
        deleteCategories,
      );

      const listProduct = await Product.find({ isValid: true })
        .select({ name: 1, overview_image: 1, price: 1 })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'categories',
          },
          {
            path: 'images',
          },
          {
            path: 'overview_image',
          },
          {
            path: 'owner',
          },
        ]);
      res.status(200).json({ msg: 'Update success!', listProduct });
    } catch (error) {
      console.log(
        '🚀 ~ file: ProductHandle.js ~ line 131 ~ updateProduct: ~ error',
        error,
      );
      return res.status(500).json({ error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await Post.findByIdAndUpdate(id, { isValid: false }, { new: true });
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
        '🚀 ~ file: ProductHandle.js ~ line 131 ~ deleteProduct: ~ error',
        error,
      );
      return res.status(500).json({ error: error.message });
    }
  },
  uploadImageProduct: async (req, res) => {
    try {
      const { id } = req.params;
      req.files.forEach(async (file, index) => {
        if (file?.fieldname === 'overview_image') {
          const product = await Product.findById(id).populate('overview_image');

          if (product?.overview_image?._id) {
            await Upload.deleteImage(product?.overview_image?.cloudinary_id);
            await Image.findByIdAndDelete(product?.overview_image?._id);
          }

          const request = {
            file: file,
            path: 'MeoNetwork/Product/Overview',
          };

          const result = await Upload.uploadSingle(request);

          const savedImage = await Image.create(result);

          product.overview_image = savedImage;

          await product.save();
        }

        if (file?.fieldname === 'images') {
          const product = await Product.findById(id).populate('images');

          if (product?.images?.length > 0) {
            product?.images.forEach(async (image) => {
              await Upload.deleteImage(image?.cloudinary_id);
            });
            await Image.findByIdAndDelete({
              _id: { $in: product?.images },
            });
          }

          const request = {
            file: file,
            path: 'MeoNetwork/Product/Images',
          };

          const result = await Upload.uploadSingle(request);

          const savedImage = await Image.create(result);

          await Product.findByIdAndUpdate(id, {
            $push: {
              images: {
                $each: [savedImage._id],
              },
            },
          });
        }

        if (req.files.length - 1 === index) {
          res.status(200).json({ msg: 'Upload image success !' });
        }
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: ProductHandle.js ~ line 138 ~ uploadImageProduct:async ~ error',
        error,
      );
      return res.status(500).json({ error: error.message });
    }
  },
};

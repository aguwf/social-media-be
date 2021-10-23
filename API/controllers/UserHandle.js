/** @format */

'use strict';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';
import Image from '../models/ImageModel.js';
import * as Upload from '../middlewares/upload.js';

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send('No user with id ' + id);

    const userDetail = await User.findById(
      id,
      {
        __v: 0,
        account: 0,
        isValid: 0,
        role: 0,
        updatedAt: 0,
        createdAt: 0,
      },
      { isValid: true },
    ).populate([
      {
        model: 'Image',
        path: 'avatar',
      },
      {
        model: 'Image',
        path: 'cover',
      },
      {
        model: 'Post',
        path: 'posts',
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: 'owner',
            model: 'User',
            populate: {
              path: 'avatar',
              model: 'Image',
            },
          },
          {
            path: 'likes',
            model: 'User',
          },

          {
            path: 'comments',
            populate: {
              path: 'owner',
              populate: {
                path: 'avatar',
              },
            },
          },
        ],
      },
    ]);

    res.status(200).json({ userDetail });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    req.files.forEach(async (file, index) => {
      if (file?.fieldname === 'avatar') {
        const user = await User.findById(req.user.id).populate('avatar');

        console.log(user);

        if (user?.avatar?._id) {
          await Upload.deleteImage(user?.avatar?.cloudinary_id);

          await Image.findByIdAndDelete(user?.avatar?._id);
        }

        const request = {
          file: file,
          path: 'MeoNetwork/Avatar',
        };

        const result = await Upload.uploadSingle(request);

        const savedImage = await Image.create(result);

        await User.findByIdAndUpdate(req.user.id, {
          avatar: savedImage._id,
          $push: {
            images: {
              $each: [savedImage._id],
            },
          },
        });
      }

      if (file?.fieldname === 'cover') {
        const user = await User.findById(req.user.id).populate('cover');

        if (user?.cover?._id) {
          await Upload.deleteImage(user?.cover?.cloudinary_id);

          await Image.findByIdAndDelete(user?.cover?._id);
        }

        const request = {
          file: file,
          path: 'MeoNetwork/Cover',
        };

        const result = await Upload.uploadSingle(request);

        const savedImage = await Image.create(result);

        await User.findByIdAndUpdate(req.user.id, {
          cover: savedImage._id,
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
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });

    res.status(200).json({ msg: 'Update success !', user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getSingleUser, uploadImage, updateUser };

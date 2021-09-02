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
    ]);

    res.status(200).json({ userDetail });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('avatar');

    await Upload.deleteImage(user?.avatar?.cloudinary_id);

    await Image.findByIdAndDelete(user?.avatar?._id);

    const request = {
      file: req.files[0],
      path: 'MeoNetwork/Avatar',
    };

    const result = await Upload.uploadSingle(request);

    const savedImage = await Image.create(result);

    await User.findByIdAndUpdate(req.user.id, { avatar: savedImage._id });

    res.status(200).json({ msg: 'Upload avatar success !' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const uploadCover = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cover');

    await Upload.deleteImage(user?.cover?.cloudinary_id);

    await Image.findByIdAndDelete(user?.cover?._id);

    const request = {
      file: req.files[0],
      path: 'MeoNetwork/Cover',
    };

    const result = await Upload.uploadSingle(request);

    const savedImage = await Image.create(result);

    await User.findByIdAndUpdate(req.user.id, { cover: savedImage._id });

    res.status(200).json({ msg: 'Upload cover image success !' });
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

export { getSingleUser, uploadAvatar, uploadCover, updateUser };

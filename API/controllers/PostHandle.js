/** @format */

import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';

export const postHandle = {
  getUserPost: async (req, res) => {
    try {
      const { id } = req.user;
      const user = await User.findById({ _id: id, isValid: true }).select(
        'following',
      );
      const allPost = await Post.find({ isValid: true })
        .sort({ createdAt: -1 })
        .select('owner');
      console.log(user, allPost);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getSinglePost: (req, res) => {
    try {
      const { id } = req.params;
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  addPost: async (req, res) => {
    try {
      let reqBody = req.body;
      const { id } = req.user;
      reqBody.owner = id;

      const savedPost = await Post.create(reqBody);
      await User.findByIdAndUpdate(
        { _id: id, isValid: true },
        {
          $push: {
            posts: {
              $each: [savedPost._id],
            },
          },
        },
        { new: true },
      );

      const listPost = !req.body.callback
        ? await Post.find({ isValid: true })
            .sort({ createdAt: -1 })
            .populate([
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
              },
            ])
        : (
            await User.findById(savedPost.owner)
              .sort({ createdAt: -1 })
              .populate([
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
                  ],
                },
              ])
          )?.posts;
      res.status(201).json({ msg: 'Create post success !', listPost });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
  updatePost: (req, res) => {
    try {
      const { id } = req.params;
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deletePost: async (req, res) => {
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
      const listPost = !req.body.callback
        ? await Post.find({ isValid: true })
            .sort({ createdAt: -1 })
            .populate([
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
              },
            ])
        : (
            await User.findById(patchPost.owner)
              .sort({ createdAt: -1 })
              .populate([
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
                  ],
                },
              ])
          )?.posts;
      res.status(200).json({ msg: 'Delete post success !', listPost });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const { id } = req.params;

      const patchPost = await Post.findById(id);
      const index = patchPost.likes.indexOf(req.user.id);
      index < 0
        ? patchPost.likes.push(req.user.id)
        : patchPost.likes.splice(index, 1);

      await patchPost.save();

      const listPost = !req.body.callback
        ? await Post.find({ isValid: true })
            .sort({ createdAt: -1 })
            .populate([
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
              },
            ])
        : (
            await User.findById(patchPost.owner)
              .sort({ createdAt: -1 })
              .populate([
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
                  ],
                },
              ])
          )?.posts;

      return res.status(200).json({ msg: 'Success', patchPost, listPost });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
  getAllPost: async (req, res) => {
    try {
      const listPost = await Post.find({ isValid: true })
        .sort({ createdAt: -1 })
        .populate([
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
          },
        ]);
      return res.status(200).json({ listPost });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
};

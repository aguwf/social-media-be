/** @format */

import Post from '../models/PostModel.js';
import Comment from '../models/CommentModel.js';
import User from '../models/UserModel.js';

export const commentHandle = {
  getCommentByPost: async (req, res) => {
    try {
      const { id } = req.user;

      const user = await User.findById({ _id: id, isValid: true });
      const allPost = await Post.find({ isValid: true }).sort({
        createdAt: -1,
      });
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
  addComment: async (req, res) => {
    try {
      const { id } = req.user;
      const { postId, comment, callback } = req.body;
      const newComment = {
        content: comment.content,
        owner: id,
        post: postId,
      };
      const savedComment = await Comment.create(newComment);

      await Post.findByIdAndUpdate(
        { _id: postId },
        {
          $push: {
            comments: {
              $each: [savedComment._id],
            },
          },
        },
        { new: true },
      );

      const listPost = callback
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
              {
                path: 'comments',
                model: 'Comment',
                populate: {
                  path: 'owner',
                  model: 'User',
                },
              },
            ])
        : (
            await User.findById(savedComment.owner)
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
                    {
                      path: 'comments',
                      model: 'Comment',
                      populate: {
                        path: 'owner',
                        model: 'User',
                      },
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
  updateComment: (req, res) => {
    try {
      const { id } = req.params;
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deleteComment: async (req, res) => {
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
  likeComment: async (req, res) => {
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
  uploadImgComment: (req, res) => {},
  replyComment: (req, res) => {},
};

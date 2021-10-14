/** @format */

import express from 'express';
import { commentHandle } from '../controllers/CommentHandle.js';
import * as upload from '../middlewares/upload.js';
import * as auth from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(auth.verify, commentHandle.getCommentByPost)
  .post(auth.verify, commentHandle.addComment);

router.route('/:id').put(auth.verify, commentHandle.updateComment);

router.route('/upload/:id').post(auth.verify, commentHandle.uploadImgComment);

router.route('/delete/:id').patch(auth.verify, commentHandle.deleteComment);

router.route('/like/:id').patch(auth.verify, commentHandle.likeComment);

router.route('/reply/:id').put(auth.verify, commentHandle.replyComment);

export default router;

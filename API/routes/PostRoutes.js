/** @format */

import express from 'express';
import { postHandle } from '../controllers/PostHandle.js';
import * as upload from '../middlewares/upload.js';
import * as auth from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(auth.verify, postHandle.getUserPost)
  .post(auth.verify, postHandle.addPost);

router.route('/delete/:id').patch(auth.verify, postHandle.deletePost);

router.route('/:id').patch(auth.verify, postHandle.likePost);

router.route('/all').get(auth.verify, postHandle.getAllPost);

export default router;

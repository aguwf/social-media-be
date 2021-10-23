/** @format */

import express from 'express';
import { categoryHandle } from '../controllers/CategoryHandle.js';
import * as upload from '../middlewares/upload.js';
import * as auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/delete/:id').patch(auth.verify, categoryHandle.deleteCategory);

router
  .route('/')
  .get(categoryHandle.getListCategory)
  .post(auth.verify, categoryHandle.addCategory);

router
  .route('/:id')
  .put(auth.verify, categoryHandle.updateCategory)
  .get(categoryHandle.getDetailCategory);

export default router;

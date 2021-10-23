/** @format */

import express from 'express';
import { productHandle } from '../controllers/ProductHandle.js';
import * as upload from '../middlewares/upload.js';
import * as auth from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(productHandle.getListProduct)
  .post(auth.verify, productHandle.addProduct);

router.route('/delete/:id').patch(auth.verify, productHandle.deleteProduct);

router
  .route('/upload/:id')
  .post(auth.verify, upload.uploadVerify, productHandle.uploadImageProduct);

router
  .route('/:id')
  .get(productHandle.getDetailProduct)
  .put(auth.verify, productHandle.updateProduct);

export default router;

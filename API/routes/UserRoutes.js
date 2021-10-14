/** @format */

import express from 'express';
import * as userHandle from '../controllers/UserHandle.js';
import * as upload from '../middlewares/upload.js';
import * as auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/:id').get(auth.verify, userHandle.getSingleUser);

router
  .route('/upload')
  .post(upload.uploadVerify, auth.verify, userHandle.uploadImage);

router.route('/update').put(auth.verify, userHandle.updateUser);

export default router;

/** @format */

import express from 'express';
import userRoute from './UserRoutes.js';
import postRoute from './PostRoutes.js';
import commentRoute from './CommentRoute.js';
import accountRoute from './AccountRoutes.js';
import searchRoute from './SearchRoute.js';
import categoryRoute from './CategoryRoute.js';
import productRoute from './ProductRoute.js';
import csrfToken from './Csrf-token.js';

const router = express.Router();

router.use('/users', userRoute);
router.use('/posts', postRoute);
router.use('/comments', commentRoute);
router.use('/accounts', accountRoute);
router.use('/categories', categoryRoute);
router.use('/products', productRoute);
router.use('/search', searchRoute);
router.use('/csrf-token', csrfToken);

export default router;

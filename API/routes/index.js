/** @format */

import express from 'express';
import userRoute from './UserRoutes.js';
import accountRoute from './AccountRoutes.js';
import searchRoute from './SearchRoute.js';
import csrfToken from './Csrf-token.js';

const router = express.Router();

router.use('/user', userRoute);
router.use('/account', accountRoute);
router.use('/search', searchRoute);
router.use('/csrf-token', csrfToken);

export default router;

/** @format */

import express from 'express';
import * as accountHandle from '../controllers/AccountHandle.js';
import * as auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/login').post(accountHandle.handleLogIn);

router.route('/activation').post(accountHandle.verifyEmail);

router.route('/forgot').post(accountHandle.handleForgotPassword);

router
  .route('/reset')
  .post(auth.verify, accountHandle.updatePasswordByUsername);

router.route('/signup').post(accountHandle.handleSignUp);

router.route('/logout').post(accountHandle.handleLogout);

router.route('/refresh_token').post(accountHandle.handleGenRefreshToken);

export default router;

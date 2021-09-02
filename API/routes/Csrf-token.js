/** @format */

import express from 'express';
import * as accountHandle from '../controllers/AccountHandle.js';
import * as auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(accountHandle.csrfToken);

export default router;

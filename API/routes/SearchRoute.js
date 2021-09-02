import express from 'express'
import * as searchHandle from '../controllers/SearchHandle.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.route('/').get(auth.verify, searchHandle.searchAll)

export default router

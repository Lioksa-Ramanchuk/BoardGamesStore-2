import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as cartController from '../controllers/cart.js';
import * as commonApiController from '../controllers/commonApi.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/',
  asyncHandler(async (req, res) => res.render('about', { account: req.account })));

export default router;
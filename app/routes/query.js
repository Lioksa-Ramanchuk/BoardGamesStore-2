import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';

const router = new Router({ mergeParams: true });

router.get('/', asyncHandler(checkAbility(Action.View, new Subject.Db())),
  asyncHandler(async (req, res) => res.render('query', { account: req.account })));

export default router;
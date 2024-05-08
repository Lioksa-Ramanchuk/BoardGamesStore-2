import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as addItemController from '../controllers/addItem.js';

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/', asyncHandler(checkAbility(Action.Manage, new Subject.Item())),
  asyncHandler(async (req, res) => res.render('add-item', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.post('/add-item', asyncHandler(checkAbility(Action.Manage, new Subject.Item())),
  upload.single('image'), asyncHandler(addItemController.handleAddItem));

export default router;
import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as updateItemController from '../controllers/updateItem.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/:item_id', asyncHandler(paramsItemId),
  asyncHandler(async (req, res) => res.render('update-item', { account: req.account, item_id: +req.params.item_id })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-item-info/:item_id', asyncHandler(paramsItemId),
  asyncHandler(updateItemController.handleGetItemInfo));
apiRouter.post('/update-item/:item_id', asyncHandler(paramsItemId),
  upload.single('image'), asyncHandler(updateItemController.handleUpdateItem));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});

export default router;

async function paramsItemId(req, res, next) {
  req.params.item_id = parseInt(req.params.item_id);
  return next();
}
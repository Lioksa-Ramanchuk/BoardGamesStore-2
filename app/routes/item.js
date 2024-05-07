import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as itemController from '../controllers/item.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/:item_id', asyncHandler(paramsItemId),
  asyncHandler(async (req, res) => res.render('item', { account: req.account, item_id: +req.params.item_id })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-item-info/:item_id', asyncHandler(paramsItemId),
  asyncHandler(itemController.handleGetItemInfo));
apiRouter.post('/toggle-in-favs/:item_id', asyncHandler(paramsItemId),
  asyncHandler(itemController.handleToggleFavouriteItem));
apiRouter.post('/toggle-in-cart/:item_id', asyncHandler(paramsItemId),
  asyncHandler(itemController.handleToggleCartItem));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});

export default router;

async function paramsItemId(req, res, next) {
  req.params.item_id = parseInt(req.params.item_id);
  return next();
}
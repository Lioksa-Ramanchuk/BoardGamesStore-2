import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as commonApiController from '../controllers/commonApi.js';

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';

const router = new Router({ mergeParams: true });

router.get('/:item_id', asyncHandler(paramsItemId),
  asyncHandler(async (req, res) => res.render('item', { account: req.account, item_id: +req.params.item_id })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-item-info/:item_id', asyncHandler(paramsItemId),
  asyncHandler(commonApiController.handleGetItemInfo));
apiRouter.post('/toggle-in-favs/:item_id', asyncHandler(paramsItemId), asyncHandler(checkAbility(Action.Manage, new Subject.Favourites())),
  asyncHandler(commonApiController.handleToggleFavouriteItem));
apiRouter.post('/toggle-in-cart/:item_id', asyncHandler(paramsItemId), asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(commonApiController.handleToggleCartItem));

export default router;

async function paramsItemId(req, res, next) {
  req.params.item_id = parseInt(req.params.item_id);
  return next();
}
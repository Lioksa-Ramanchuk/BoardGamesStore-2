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
  asyncHandler(async (req, res) => res.render('cart', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-cart-items',
  asyncHandler(cartController.handleGetCartItems));
apiRouter.get('/get-cart-cost',
  asyncHandler(cartController.handleGetCartCost));
apiRouter.post('/validate-cart',
  asyncHandler(cartController.handleValidateCart));
apiRouter.post('/clear-cart',
  asyncHandler(cartController.handleClearCart));
apiRouter.post('/update-cart-item-quantity',
  asyncHandler(cartController.handleUpdateCartItemQuantity));
apiRouter.post('/toggle-in-favs/:item_id', asyncHandler(paramsItemId),
  asyncHandler(commonApiController.handleToggleFavouriteItem));
apiRouter.post('/toggle-in-cart/:item_id', asyncHandler(paramsItemId),
  asyncHandler(commonApiController.handleToggleCartItem));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});

export default router;

async function paramsItemId(req, res, next) {
  req.params.item_id = parseInt(req.params.item_id);
  return next();
}
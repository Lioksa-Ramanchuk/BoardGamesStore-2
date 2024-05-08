import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as cartController from '../controllers/cart.js';
import * as commonApiController from '../controllers/commonApi.js';

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';

const router = new Router({ mergeParams: true });

router.get('/', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(async (req, res) => res.render('cart', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-cart-items', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(cartController.handleGetCartItems));
apiRouter.get('/get-cart-cost', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(commonApiController.handleGetCartCost));
apiRouter.post('/validate-cart', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(commonApiController.handleValidateCart));
apiRouter.post('/clear-cart', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(cartController.handleClearCart));
apiRouter.post('/update-cart-item-quantity', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(cartController.handleUpdateCartItemQuantity));
apiRouter.post('/toggle-in-favs/:item_id', asyncHandler(paramsItemId), asyncHandler(checkAbility(Action.Manage, new Subject.Favourites())),
  asyncHandler(commonApiController.handleToggleFavouriteItem));
apiRouter.post('/toggle-in-cart/:item_id', asyncHandler(paramsItemId), asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(commonApiController.handleToggleCartItem));

export default router;

async function paramsItemId(req, res, next) {
  req.params.item_id = parseInt(req.params.item_id);
  return next();
}
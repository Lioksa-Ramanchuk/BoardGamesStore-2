import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as commonApiController from '../controllers/commonApi.js';
import * as favouritesController from '../controllers/favourites.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/',
  asyncHandler(async (req, res) => res.render('favourites', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-favourite-items',
  asyncHandler(favouritesController.handleGetFavouriteItems));
apiRouter.post('/move-favs-to-cart',
  asyncHandler(favouritesController.handleMoveFavouritesToCart));
apiRouter.post('/clear-favourites',
  asyncHandler(favouritesController.handleClearFavourites));
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
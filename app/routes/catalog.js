import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as catalogController from '../controllers/catalog.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/',
  asyncHandler(async (req, res) => res.render('catalog', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-catalog',
  asyncHandler(catalogController.handleGetCatalog));
apiRouter.post('/toggle-in-favs/:item_id', asyncHandler(paramsItemId),
  asyncHandler(catalogController.handleToggleFavouriteItem));
apiRouter.post('/toggle-in-cart/:item_id', asyncHandler(paramsItemId),
  asyncHandler(catalogController.handleToggleCartItem));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});

export default router;

async function paramsItemId(req, res, next) {
  req.params.item_id = parseInt(req.params.item_id);
  return next();
}
import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as commonApiController from '../controllers/commonApi.js';
import * as orderingController from '../controllers/ordering.js';

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/', asyncHandler(checkAbility(Action.Create, new Subject.Order())),
  asyncHandler(async (req, res) => res.render('ordering', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-client-address', asyncHandler(checkAbility(Action.Manage, new Subject.ClientAccount())),
  asyncHandler(orderingController.handleGetClientAddress));
apiRouter.get('/get-cart-cost', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(commonApiController.handleGetCartCost));
apiRouter.post('/validate-cart', asyncHandler(checkAbility(Action.Manage, new Subject.Cart())),
  asyncHandler(commonApiController.handleValidateCart));
apiRouter.post('/make-order', asyncHandler(checkAbility(Action.Create, new Subject.Order())),
  upload.none(), asyncHandler(orderingController.handleMakeOrder));

export default router;
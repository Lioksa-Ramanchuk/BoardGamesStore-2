import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as commonApiController from '../controllers/commonApi.js';
import * as orderController from '../controllers/order.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/',
  asyncHandler(async (req, res) => res.render('orders', { account: req.account })));
router.get('/:order_id', asyncHandler(paramsOrderId),
  asyncHandler(async (req, res) => res.render('orders', { account: req.account, order_id: +req.params.order_id })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-all-orders-list',
  asyncHandler(orderController.handleGetAllOrdersList));
apiRouter.get('/get-client-orders-list',
  asyncHandler(orderController.handleGetClientOrdersList));
apiRouter.get('/get-order-info/:order_id', asyncHandler(paramsOrderId),
  asyncHandler(orderController.handleGetOrderInfo));
apiRouter.get('/get-order-statuses',
  asyncHandler(orderController.handleGetOrderStatuses));
apiRouter.get('/get-order-items/:order_id', asyncHandler(paramsOrderId),
  asyncHandler(orderController.handleGetOrderItems));
apiRouter.post('/set-order-status',
  asyncHandler(orderController.handleSetOrderStatus));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});

export default router;

async function paramsOrderId(req, res, next) {
  req.params.order_id = parseInt(req.params.order_id);
  return next();
}
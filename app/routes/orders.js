import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as orderController from '../controllers/order.js';
import * as orderService from '../services/orderService.js';

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';

const router = new Router({ mergeParams: true });

router.get('/', asyncHandler(checkAbility(Action.View, new Subject.OrdersList())),
  asyncHandler(async (req, res) => res.render('orders', { account: req.account })));
router.get('/:order_id', asyncHandler(paramsOrderId), asyncHandler(checkAbility(Action.View, new Subject.Order())),
  asyncHandler(async (req, res) => res.render('orders', { account: req.account, order_id: +req.params.order_id })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-all-orders-list', asyncHandler(checkAbility(Action.Manage, new Subject.Order())),
  asyncHandler(orderController.handleGetAllOrdersList));
apiRouter.get('/get-client-orders-list', asyncHandler(checkAbility(Action.Create, new Subject.Order())),
  asyncHandler(orderController.handleGetClientOrdersList));
apiRouter.get('/get-order-info/:order_id', asyncHandler(paramsOrderId), asyncHandler(checkAbility(Action.View, new Subject.Order())),
  asyncHandler(orderController.handleGetOrderInfo));
apiRouter.get('/get-order-statuses', asyncHandler(checkAbility(Action.Manage, new Subject.Order())),
  asyncHandler(orderController.handleGetOrderStatuses));
apiRouter.get('/get-order-items/:order_id', asyncHandler(paramsOrderId), asyncHandler(checkAbility(Action.View, new Subject.Order())),
  asyncHandler(orderController.handleGetOrderItems));
apiRouter.post('/set-order-status', asyncHandler(checkAbility(Action.Manage, new Subject.Order())),
  asyncHandler(orderController.handleSetOrderStatus));

export default router;

async function paramsOrderId(req, res, next) {
  req.params.order_id = parseInt(req.params.order_id);
  const order = await orderService.getById(req.params.order_id);
  req.params.orderer_id = order?.account_id;
  return next();
}
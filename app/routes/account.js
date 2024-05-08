import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as accountController from '../controllers/account.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/',
  asyncHandler(async (req, res) => res.render('account', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-account-info', asyncHandler(checkAbility(Action.Manage, new Subject.Account())),
  asyncHandler(accountController.handleGetAccountInfo));
apiRouter.post('/sign-up',
  upload.none(), asyncHandler(accountController.handleSignUp));
apiRouter.post('/sign-in',
  upload.none(), asyncHandler(accountController.handleSignIn));
apiRouter.post('/update-account-info', asyncHandler(checkAbility(Action.Manage, new Subject.Account())),
  upload.none(), asyncHandler(accountController.handleUpdateAccountInfo));
apiRouter.post('/update-client-account-info', asyncHandler(checkAbility(Action.Manage, new Subject.ClientAccount())),
  upload.none(), asyncHandler(accountController.handleUpdateClientAccountInfo));
apiRouter.post('/create-new-admin-account', asyncHandler(checkAbility(Action.Create, new Subject.NewAdminAccount())),
  upload.none(), asyncHandler(accountController.handleCreateNewAdminAccount));
apiRouter.post('/sign-out', asyncHandler(checkAbility(Action.Manage, new Subject.Account())),
  asyncHandler(accountController.handleSignOut));
apiRouter.post('/deactivate-account', asyncHandler(checkAbility(Action.Manage, new Subject.Account())),
  asyncHandler(accountController.handleDeactivateAccount));
apiRouter.post('/reactivate-account',
  upload.none(), asyncHandler(accountController.handleReactivateAccount));

export default router;
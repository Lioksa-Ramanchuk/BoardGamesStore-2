import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';
import * as accountController from '../controllers/account.js';

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import checkAbility from '../middleware/checkAbility.js';
import upload from '../middleware/upload.js';

const router = new Router({ mergeParams: true });

router.get('/', //asyncHandler(checkAbility(Action.See, new Subject.AccountView())),
  asyncHandler(async (req, res) => res.render('account', { account: req.account })));

const apiRouter = new Router({ mergeParams: true });
router.use('/api', apiRouter);

apiRouter.get('/get-account-info',
  asyncHandler(accountController.handleGetAccountInfo));
apiRouter.post('/sign-up', //asyncHandler(checkAbility(Action.SignUp, new Subject.ClientAccount())),
  upload.none(), asyncHandler(accountController.handleSignUp));
apiRouter.post('/sign-in', //asyncHandler(checkAbility(Action.SignIn, new Subject.Account())),
  upload.none(), asyncHandler(accountController.handleSignIn));
apiRouter.post('/update-account-info',
  upload.none(), asyncHandler(accountController.handleUpdateAccountInfo));
apiRouter.post('/update-client-account-info',
  upload.none(), asyncHandler(accountController.handleUpdateClientAccountInfo));
apiRouter.post('/create-new-admin-account',
  upload.none(), asyncHandler(accountController.handleCreateNewAdminAccount));
apiRouter.post('/sign-out',
  asyncHandler(accountController.handleSignOut));
apiRouter.post('/deactivate-account',
  asyncHandler(accountController.handleDeactivateAccount));
apiRouter.post('/reactivate-account',
  upload.none(), asyncHandler(accountController.handleReactivateAccount));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});

export default router;
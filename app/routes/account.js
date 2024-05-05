import * as Action from '../security/action.js';
import * as Subject from '../security/subject.js';

import { handleCreateNewAdminAccount, handleDeactivateAccount, handleGetAccountInfo, handleReactivateAccount, handleSignIn, handleSignOut, handleSignUp, handleUpdateAccountInfo, handleUpdateClientAccountInfo } from '../controllers/account.js';

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
  asyncHandler(handleGetAccountInfo));
apiRouter.post('/sign-up', //asyncHandler(checkAbility(Action.SignUp, new Subject.ClientAccount())),
  upload.none(), asyncHandler(handleSignUp));
apiRouter.post('/sign-in', //asyncHandler(checkAbility(Action.SignIn, new Subject.Account())),
  upload.none(), asyncHandler(handleSignIn));
apiRouter.post('/update-account-info',
  upload.none(), asyncHandler(handleUpdateAccountInfo));
apiRouter.post('/update-client-account-info',
  upload.none(), asyncHandler(handleUpdateClientAccountInfo));
apiRouter.post('/create-new-admin-account',
  upload.none(), asyncHandler(handleCreateNewAdminAccount));
apiRouter.post('/sign-out',
  asyncHandler(handleSignOut));
apiRouter.post('/deactivate-account',
  asyncHandler(handleDeactivateAccount));
apiRouter.post('/reactivate-account',
  upload.none(), asyncHandler(handleReactivateAccount));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});

export default router;
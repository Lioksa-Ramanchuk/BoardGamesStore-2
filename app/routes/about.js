import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const router = new Router({ mergeParams: true });

router.get('/',
  asyncHandler(async (req, res) => res.render('about', { account: req.account })));

export default router;
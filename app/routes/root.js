import { Router } from 'express';
import accountRouter from './account.js';
import casl from 'casl';

const router = new Router();

router.use('/account', accountRouter);

router.get('/', (req, res) => res.redirect('/account'));

router.use((req, res, next) => {
  res.render('error', { error: { message: 'Такой старонкі няма!' } });
});

router.use((err, req, res, next) => {
  if (err instanceof casl.ForbiddenError) {
    return res.render('error', { error: { message: 'Вам сюды нельга!' } });
  }
  console.error(err);
  return res.render('error', { error: { message: 'На серверы адбылася памылачка... 😔' } });
});

export default router;
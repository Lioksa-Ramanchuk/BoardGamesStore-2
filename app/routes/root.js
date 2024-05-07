import { Router } from 'express';
import accountRouter from './account.js';
import addItemRouter from './add-item.js';
import casl from 'casl';
import catalogRouter from './catalog.js';
import updateItemRouter from './update-item.js';

const router = new Router();

router.use('/catalog', catalogRouter);
router.use('/add-item', addItemRouter);
router.use('/update-item', updateItemRouter);
router.use('/account', accountRouter);

router.get('/', (req, res) => res.redirect('/catalog'));

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
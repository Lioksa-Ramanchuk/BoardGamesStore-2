// const router = require('express').Router({ mergeParams: true });
// const asyncHandler = require('express-async-handler');
// const { handleGetAll, handleGetById, handleCreate, handleUpdate, handleDelete } = require('../controllers/_repo').default;
// const checkAbility = require('../middleware/checkAbility').default;
// const Action = require('../security/_action');
// const Subject = require('../security/_subject').default;
// const repoService = require('../services/_repoService');

// router.use('/:id/commits', require('./_commits'));

// router.get('/',
//   checkAbility(Action.Read, new Subject.ReposAll()), asyncHandler(handleGetAll));
// router.get('/:id', asyncHandler(paramsId),
//   checkAbility(Action.Read, new Subject.Repos()), asyncHandler(handleGetById));
// router.post('/',
//   checkAbility(Action.Create, new Subject.Repos()), asyncHandler(handleCreate));

// router.put('/:id', asyncHandler(paramsId), asyncHandler(paramsAuthorId),
//   checkAbility(Action.Update, new Subject.Repos()), asyncHandler(handleUpdate));
// router.delete('/:id', asyncHandler(paramsId), asyncHandler(paramsAuthorId),
//   checkAbility(Action.Delele, new Subject.Repos()), asyncHandler(handleDelete));

// async function paramsId(req, res, next) {
//   req.params.id = parseInt(req.params.id);
//   return next();
// }

// async function paramsAuthorId(req, res, next) {
//   req.params.authorId = (await repoService.getById(req.params.id))?.authorId;
//   return next();
// }

// module.exports = router;
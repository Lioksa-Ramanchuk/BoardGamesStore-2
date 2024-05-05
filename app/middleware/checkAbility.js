import casl from 'casl';

export default function checkAbility(action, subject) {
  return async (req, res, next) => {
    Object.assign(subject, req.params);
    if (!req.ability.can(action, subject)) {
      return next(new casl.ForbiddenError('Forbidden'));
    }
    return next();
  };
}
import * as Action from '../security/action.js';
import * as Role from '../security/role.js';
import * as Subject from '../security/subject.js';

import casl from 'casl';

export default async function authorize(req, res, next) {
  const { rules, can } = casl.AbilityBuilder.extract();

  const account = req.account;

  switch (account.role) {
    case Role.Guest:
      break;
    case Role.Client:
      can(Action.Manage, [Subject.Account.name, Subject.ClientAccount.name, Subject.Cart.name, Subject.Favourites.name]);
      can(Action.Create, Subject.Order.name);
      can(Action.View, Subject.Order.name, { orderer_id: account.id });
      can(Action.View, Subject.OrdersList.name);
      break;
    case Role.Admin:
      can(Action.Manage, [Subject.Account.name, Subject.Item.name, Subject.Order.name]);
      can(Action.Create, Subject.NewAdminAccount.name);
      can(Action.View, [Subject.Order.name, Subject.Db.name]);
      can(Action.View, Subject.OrdersList.name);
      break;
    default:
      break;
  }
  req.ability = new casl.Ability(rules);
  return next();
}
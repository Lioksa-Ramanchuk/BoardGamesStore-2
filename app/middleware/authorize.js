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
      // Дазваляецца кіраванне звесткамі ўласнага акаўнта, уласным кошыкам, уласнай калекцыяй абранага
      can(Action.Manage, [Subject.Account.name, Subject.ClientAccount.name, Subject.Cart.name, Subject.Favourites.name]);
      // Дазваляецца стварэнне заказаў
      can(Action.Create, Subject.Order.name);
      // Дазваляецца прагляд сваіх заказаў
      can(Action.View, Subject.Order.name, { orderer_id: account.id });
      // Дазваляецца прагляд спісу сваіх заказаў
      can(Action.View, Subject.OrdersList.name);
      break;
    case Role.Admin:
      // Дазваляецца кіраванне звесткамі ўласнага акаўнта, таварамі, заказамі кліентаў
      can(Action.Manage, [Subject.Account.name, Subject.Item.name, Subject.Order.name]);
      // Дазваляецца стварэнне новых адміністратараў
      can(Action.Create, Subject.NewAdminAccount.name);
      // Дазваляецца прагляд заказаў, прагляд зместу базы даных (SELECT-запыты)
      can(Action.View, [Subject.Order.name, Subject.Db.name]);
      // Дазваляецца прагляд спісу заказаў кліентаў
      can(Action.View, Subject.OrdersList.name);
      break;
    default:
      break;
  }
  req.ability = new casl.Ability(rules);
  return next();
}
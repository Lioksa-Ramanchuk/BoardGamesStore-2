import * as Action from '../security/action.js';
import * as Role from '../security/role.js';
import * as Subject from '../security/subject.js';

import casl from 'casl';

export default async function authorize(req, res, next) {
  const { rules, can } = casl.AbilityBuilder.extract();

  const account = req.account;

  switch (account.role) {
    case Role.Guest:
      can(Action.SignIn, Subject.AccountView.name);
      //can(Read, [Subject.ReposAll.name, Subject.CommitsAll.name]);
      //can(Read, [Subject.Repos.name, Subject.Commits.name]);
      break;
    case Role.Client:
      //can(Read, Subject.Ability.name);
      //can(Read, [Subject.ReposAll.name, Subject.CommitsAll.name]);
      //can(Read, Subject.Account.name, { id: account.id, });
      //can(Read, [Subject.Repos.name, Subject.Commits.name]);
      //can(Create, [Subject.Repos.name, Subject.Commits.name]);
      //can([Update, Delele], [Subject.Repos.name, Subject.Commits.name], { authorId: account.id, });
      break;
    case Role.Admin:
      //can(Read, Subject.Ability.name);
      //can(Read, [Subject.ReposAll.name, Subject.CommitsAll.name, Subject.AccountsAll.name]);
      //can(Read, [Subject.Account.name, Subject.Repos.name, Subject.Commits.name]);
      //can([Update, Delele], [Subject.Repos.name, Subject.Commits.name]);
      break;
    default:
      break;
  }
  req.ability = new casl.Ability(rules);
  return next();
}
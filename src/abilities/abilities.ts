import { Ability } from "@casl/ability";
import { IPermission } from "../models/IPermission";
import { IUser } from "../models/IUser";
import { store } from "../store/store";

const abilities = new Ability(store.getState().auth.user?.permissions);

let currentUser: (IUser & { permissions: IPermission[] }) | null;
store.subscribe(() => {
  const prevUser = currentUser;
  currentUser = store.getState().auth.user;
  if (prevUser !== currentUser) {
    abilities.update(new Ability(currentUser?.permissions).rules);
  }
});

export default abilities;

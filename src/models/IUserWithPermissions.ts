import { IPermission } from "./IPermission";
import { IUser } from "./IUser";

export interface IUserWithPermissions extends IUser {
  permissions: IPermission[];
}

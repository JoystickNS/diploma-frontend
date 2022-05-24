import { IRole } from "./IRole";
import { IUser } from "./IUser";

export interface IUserWithRoles extends IUser {
  roles: IRole[];
}

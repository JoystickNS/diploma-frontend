import { IUserWithPermissions } from "./IUserWithPermissions";

export interface IAuth {
  user: IUserWithPermissions;
  accessToken: string;
}

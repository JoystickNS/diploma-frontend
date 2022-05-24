import { IRole } from "../../../models/IRole";

export interface IUserWithRolesTable {
  key: number;
  fullName: string;
  login: string;
  roles: IRole[];
}

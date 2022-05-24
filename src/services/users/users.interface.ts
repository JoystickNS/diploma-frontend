import { IQueryArg } from "../api.interface";

export interface IUsersArgs extends IQueryArg {
  name?: string;
  login?: string;
}

export interface IUserRoleArgs {
  userId: number;
  roleId: number;
}

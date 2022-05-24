import { IPermission } from "../../../models/IPermission";
import { IUser } from "../../../models/IUser";

export interface IAuthState {
  user: (IUser & { permissions: IPermission[] }) | null;
  accessToken: string;
}

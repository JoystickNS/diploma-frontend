import { IRole } from "../../../../models/IRole";

export interface RolesDropdownProps {
  userId: number;
  roles: IRole[];
  onItemClick: (userId: number, roleId: number) => void;
}

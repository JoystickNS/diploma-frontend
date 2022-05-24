export interface RoleItemProps {
  color: string | undefined;
  userId: number;
  roleId: number;
  roleName: string;
  onDelete: (userId: number, roleId: number) => void;
}

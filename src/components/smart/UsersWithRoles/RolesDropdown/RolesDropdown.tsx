import { Dropdown, Menu } from "antd";
import { FC, memo } from "react";
import AddItemButton from "../../../simple/AddItemButton/AddItemButton";
import { RolesDropdownProps } from "./RolesDropdown.interface";

const RolesDropdown: FC<RolesDropdownProps> = ({
  userId,
  roles,
  onItemClick,
}) => {
  const handleClick = (roleId: number) => {
    onItemClick(userId, roleId);
  };

  console.log("RolesDropdown RENDER");

  const menu = (
    <Menu
      onClick={({ key }) => handleClick(+key)}
      items={roles.map((role) => ({
        label: <span>{role.name}</span>,
        key: role.id,
      }))}
    ></Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <AddItemButton tooltipText="Добавить роль" />
    </Dropdown>
  );
};

export default memo(RolesDropdown);

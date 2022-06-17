import { CloseOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { FC, memo } from "react";
import AppPopConfirm from "../../../simple/AppPopConfirm/AppPopConfirm";
import { RoleItemProps } from "./RoleItem.interface";

const RoleItem: FC<RoleItemProps> = ({
  color,
  userId,
  roleId,
  roleName,
  onDelete,
}) => {
  const handleDeleteRole = (userId: number, roleId: number) => {
    onDelete(userId, roleId);
  };

  return (
    <Tag
      color={color}
      closable
      closeIcon={
        <AppPopConfirm onConfirm={() => handleDeleteRole(userId, roleId)}>
          <CloseOutlined />
        </AppPopConfirm>
      }
      onClose={(e) => e.preventDefault()}
    >
      {roleName}
    </Tag>
  );
};

export default memo(RoleItem);

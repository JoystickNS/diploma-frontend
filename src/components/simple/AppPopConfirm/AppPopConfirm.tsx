import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { FC } from "react";
import { AppPopConfirmProps } from "./AppPopConfirm.interface";

const AppPopConfirm: FC<AppPopConfirmProps> = ({
  disabled,
  onConfirm,
  children,
}) => {
  return (
    <Popconfirm
      title="Вы уверены?"
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      okText="Подтвердить"
      onConfirm={onConfirm}
      disabled={disabled}
    >
      {children}
    </Popconfirm>
  );
};

export default AppPopConfirm;

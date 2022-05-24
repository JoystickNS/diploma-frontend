import { EditOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { FC } from "react";
import { EditButtonProps } from "./EditButton.interface";

const EditButton: FC<EditButtonProps> = ({ buttonSize, onClick, ...props }) => {
  return (
    <Popover content="Редактировать">
      <Button
        type="link"
        style={{ padding: 0 }}
        size="small"
        disabled={props.disabled}
      >
        <EditOutlined
          style={{ color: props.disabled ? "gray" : "blue", fontSize: 20 }}
          onClick={onClick}
        />
      </Button>
    </Popover>
  );
};

export default EditButton;

EditButton.defaultProps = {
  buttonSize: 20,
};

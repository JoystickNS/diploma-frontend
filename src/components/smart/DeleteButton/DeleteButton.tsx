import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { FC } from "react";
import AppPopConfirm from "../../simple/AppPopConfirm/AppPopConfirm";
import { DeleteButtonProps } from "./DeleteButton.interface";

const DeleteButton: FC<DeleteButtonProps> = ({
  onConfirm,
  buttonSize,
  ...props
}) => {
  return (
    <AppPopConfirm onConfirm={onConfirm} disabled={props.disabled}>
      <Popover content="Удалить">
        <Button type="link" style={{ padding: 0 }} size="small" {...props}>
          <DeleteOutlined
            style={{
              color: props.disabled ? "gray" : "red",
              fontSize: buttonSize,
            }}
          />
        </Button>
      </Popover>
    </AppPopConfirm>
  );
};

DeleteButton.defaultProps = {
  buttonSize: 20,
};

export default DeleteButton;

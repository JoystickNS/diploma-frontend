import { EditOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { FC, memo } from "react";
import { EditButtonProps } from "./EditButton.interface";

const EditButton: FC<EditButtonProps> = ({
  buttonSize,
  tooltipText,
  ...props
}) => {
  return (
    <Popover content={tooltipText}>
      <Button type="link" style={{ padding: 0 }} size="small" {...props}>
        <EditOutlined
          style={{ color: props.disabled ? "gray" : "blue", fontSize: 20 }}
        />
      </Button>
    </Popover>
  );
};

export default memo(EditButton);

EditButton.defaultProps = {
  buttonSize: 20,
};

import { PlusOutlined } from "@ant-design/icons";
import { Button, Popover, Tag } from "antd";
import { FC } from "react";
import { AddItemButtonProps } from "./AddItemButton.interface";
import s from "./AddItemButton.module.scss";

const AddItemButton: FC<AddItemButtonProps> = ({
  tooltipText,
  disabled,
  ...props
}) => {
  return (
    <Popover content={tooltipText}>
      <Button
        type="link"
        style={{ padding: 0 }}
        size="small"
        disabled={disabled}
      >
        <Tag
          color={disabled ? "gray" : "green"}
          className={s.addItem}
          style={{ margin: 0 }}
          {...props}
        >
          <PlusOutlined />
        </Tag>
      </Button>
    </Popover>
  );
};

AddItemButton.defaultProps = {
  disabled: false,
};

export default AddItemButton;

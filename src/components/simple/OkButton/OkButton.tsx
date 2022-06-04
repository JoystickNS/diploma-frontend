import { CheckOutlined } from "@ant-design/icons";
import { Popover, Button } from "antd";
import { FC, memo } from "react";
import { OkButtonProps } from "./OkButton.interface";

const OkButton: FC<OkButtonProps> = ({ buttonSize, tooltipText, ...props }) => {
  // console.log("OK BUTTON RENDER");
  return (
    <Popover content={tooltipText}>
      <Button type="link" style={{ padding: 0 }} size="small" {...props}>
        <CheckOutlined style={{ color: "green", fontSize: buttonSize }} />
      </Button>
    </Popover>
  );
};

export default memo(OkButton);

OkButton.defaultProps = {
  buttonSize: 20,
};

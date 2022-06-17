import { CloseOutlined } from "@ant-design/icons";
import { Popover, Button } from "antd";
import { FC, memo } from "react";
import { CancelButtonProps } from "./CancelButton.interface";

const CancelButton: FC<CancelButtonProps> = ({
  buttonSize,
  tooltipText,
  ...props
}) => {
  return (
    <Popover content={tooltipText}>
      <Button type="link" style={{ padding: 0 }} size="small" {...props}>
        <CloseOutlined style={{ color: "red", fontSize: 20 }} />
      </Button>
    </Popover>
  );
};

export default memo(CancelButton);

CancelButton.defaultProps = {
  buttonSize: 20,
};

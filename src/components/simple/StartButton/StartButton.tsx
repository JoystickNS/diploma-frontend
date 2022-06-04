import { Button, Popover } from "antd";
import { FC, memo } from "react";
import StartIcon from "../../Icons/Start";
import { StartButtonProps } from "./StartButton.interface";

const StartButton: FC<StartButtonProps> = ({
  buttonSize,
  tooltipText,
  ...props
}) => {
  // console.log("RENDER START BUTTON");

  return (
    <Popover content={tooltipText}>
      <Button type="link" style={{ padding: 0 }} size="small" {...props}>
        <StartIcon
          style={{
            fontSize: buttonSize,
            color: props.disabled ? "gray" : "green",
          }}
        />
      </Button>
    </Popover>
  );
};

export default memo(StartButton);

import { Button, Popover } from "antd";
import { FC } from "react";
import StartIcon from "../../Icons/Start";
import { StartButtonProps } from "./StartButton.interface";

const StartButton: FC<StartButtonProps> = ({
  buttonSize,
  tooltipText,
  ...props
}) => {
  return (
    <Popover content={tooltipText}>
      <Button
        type="link"
        style={{ padding: 0, marginLeft: 2 }}
        size="small"
        {...props}
      >
        <StartIcon
          style={{
            fontSize: buttonSize,
            color: "green",
          }}
        />
      </Button>
    </Popover>
  );
};

export default StartButton;

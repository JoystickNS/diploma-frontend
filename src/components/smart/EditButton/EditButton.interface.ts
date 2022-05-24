import { ButtonProps } from "antd";

export interface EditButtonProps extends ButtonProps {
  onClick: () => void;
  buttonSize?: number;
}

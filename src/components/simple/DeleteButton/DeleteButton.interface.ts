import { ButtonProps } from "antd";

export interface DeleteButtonProps extends ButtonProps {
  tooltipText?: string;
  buttonSize?: number;
  onConfirm: () => void;
}

import { ButtonProps } from "antd";

export interface DeleteButtonProps extends ButtonProps {
  buttonSize?: number;
  onConfirm: () => void;
}

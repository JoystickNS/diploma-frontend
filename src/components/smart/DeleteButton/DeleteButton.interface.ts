import { ButtonProps } from "antd";

export interface DeleteButtonProps extends ButtonProps {
  onConfirm: () => void;
  buttonSize?: number;
}

import { ReactNode } from "react";

export interface PopCodeConfirmProps {
  code: string;
  children: ReactNode;
  text?: ReactNode;
  onOk: () => void;
}

import { ReactNode } from "react";

export interface PopCodeConfirmProps {
  code: string;
  children: ReactNode;
  text?: string;
  onOk: () => void;
}

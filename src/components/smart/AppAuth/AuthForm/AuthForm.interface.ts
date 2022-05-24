import { Rule } from "antd/lib/form";
import { ReactNode } from "react";

export interface IAuthFormProps {
  loginPlaceholder: string;
  loginInputPrefix: ReactNode;
  loginInputRules?: Rule[];
  loginInputMaxLength?: number;
  passwordPlaceholder: string;
  isPasswordInput?: boolean;
  passwordInputPrefix: ReactNode;
  passwordInputRules?: Rule[];
  passwordInputMaxLength?: number;
}

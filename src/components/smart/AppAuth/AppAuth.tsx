import { Card, Tabs } from "antd";
import { FC } from "react";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import { Rule } from "antd/lib/form";
import { authPlaceholders } from "../../../constants/auth-placeholders";
import AuthForm from "./AuthForm/AuthForm";
import s from "./AppAuth.module.scss";
import { rules } from "../../../utils/rules";
import { FieldNumberOutlined } from "@ant-design/icons";

const workerLoginInputRules: Rule[] = [
  rules.required(
    `Пожалуйста, введите ${authPlaceholders.workerLoginPlaceholder}`
  ),
  rules.pattern(/\w/, "Разрешённые символы A-Z, a-z, 0-9, _"),
];

const workerPasswordInputRules = [
  rules.required(
    `Пожалуйста, введите ${authPlaceholders.workerPasswordPlaceholder}`
  ),
];

const studentLoginInputRules = [
  rules.required(
    `Пожалуйста, введите ${authPlaceholders.studentLoginPlaceholder}`
  ),
  rules.pattern(
    /^\d{6}$/,
    `Пожалуйста, введите правильный ${authPlaceholders.studentLoginPlaceholder}`
  ),
];

const studentPasswordInputRules = [
  rules.required(
    `Пожалуйста, введите ${authPlaceholders.studentPasswordPlaceholder}`
  ),
  rules.pattern(
    /^\d{6}$/,
    `Пожалуйста, введите правильный ${authPlaceholders.studentPasswordPlaceholder}`
  ),
];

const { TabPane } = Tabs;

const AppAuth: FC = () => {
  return (
    <Card className={s.login}>
      <h2 className={s.loginHeader}>Вход в систему</h2>
      <Tabs className={s.tabs} size="large" type="card">
        <TabPane tab="Работник УГТУ" key="1">
          <AuthForm
            loginPlaceholder={authPlaceholders.workerLoginPlaceholder}
            loginInputPrefix={<UserOutlined />}
            loginInputRules={workerLoginInputRules}
            passwordPlaceholder={authPlaceholders.workerPasswordPlaceholder}
            isPasswordInput
            passwordInputPrefix={<LockOutlined />}
            passwordInputRules={workerPasswordInputRules}
          />
        </TabPane>
        <TabPane tab="Студент" key="2">
          <AuthForm
            loginPlaceholder={authPlaceholders.studentLoginPlaceholder}
            loginInputPrefix={<FieldNumberOutlined />}
            loginInputRules={studentLoginInputRules}
            loginInputMaxLength={6}
            passwordPlaceholder={authPlaceholders.studentPasswordPlaceholder}
            passwordInputPrefix={<FieldNumberOutlined />}
            passwordInputRules={studentPasswordInputRules}
            passwordInputMaxLength={6}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default AppAuth;

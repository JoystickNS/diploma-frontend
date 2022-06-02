import { Alert, Button, Checkbox, Form, Input, Row } from "antd";
import { InputStatus } from "antd/lib/_util/statusUtils";
import { FC, useEffect, useState } from "react";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../hooks/redux";
import { IAuthArgs } from "../../../../services/auth/auth.interface";
import { useLoginMutation } from "../../../../services/auth/auth.service";
import { loginAction } from "../../../../store/slices/auth/auth.slice";
import { IAuthFormProps } from "./AuthForm.interface";

export type LocationProps = {
  state: {
    from: Location;
  };
};

const AuthForm: FC<IAuthFormProps> = ({
  loginPlaceholder,
  loginInputPrefix,
  loginInputRules,
  loginInputMaxLength,
  passwordPlaceholder,
  isPasswordInput,
  passwordInputPrefix,
  passwordInputRules,
  passwordInputMaxLength,
}) => {
  let formErrorMessage = "";
  const PasswordInput = isPasswordInput ? Input.Password : Input;
  const [inputErrorStatus, setInputErrorStatus] = useState<InputStatus>("");
  const [loginAPI, { isLoading: loginAPIIsLoading, error: loginAPIError }] =
    useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation() as LocationProps;
  const from = location.state?.from.pathname || "/";

  const onFinish = async (values: IAuthArgs) => {
    const res = await loginAPI(values);
    if ("data" in res) {
      const data = res.data;
      dispatch(loginAction(data));
      navigate(from, { replace: true });
    }
  };

  const onFieldsChange = () => {
    if (inputErrorStatus) {
      setInputErrorStatus("");
    }
  };

  if (loginAPIError) {
    if ("data" in loginAPIError) {
      const errorData = JSON.parse(JSON.stringify(loginAPIError.data));
      formErrorMessage = errorData.message || "Произошла какая-то ошибка";
    }
  }

  useEffect(() => {
    if (loginAPIError) {
      setInputErrorStatus("error");
    }
  }, [loginAPIError]);

  return (
    <Form
      name="login"
      initialValues={{ rememberMe: false }}
      onFinish={onFinish}
      onFieldsChange={onFieldsChange}
    >
      <Form.Item name="login" rules={loginInputRules}>
        <Input
          placeholder={loginPlaceholder}
          prefix={loginInputPrefix}
          maxLength={loginInputMaxLength}
          status={inputErrorStatus}
        />
      </Form.Item>
      <Form.Item name="password" rules={passwordInputRules}>
        <PasswordInput
          placeholder={passwordPlaceholder}
          prefix={passwordInputPrefix}
          maxLength={passwordInputMaxLength}
          status={inputErrorStatus}
        />
      </Form.Item>
      <Row justify="space-between">
        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loginAPIIsLoading}>
            Войти
          </Button>
        </Form.Item>
      </Row>
      {inputErrorStatus && (
        <Alert
          message="Ошибка авторизации"
          description={formErrorMessage}
          type="error"
          showIcon
        ></Alert>
      )}
    </Form>
  );
};

AuthForm.defaultProps = {
  isPasswordInput: false,
};

export default AuthForm;

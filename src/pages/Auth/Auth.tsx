import { Row } from "antd";
import { FC } from "react";
import AppAuth from "../../components/smart/AppAuth/AppAuth";

const Auth: FC = () => {
  return (
    <Row justify="center">
      <AppAuth />
    </Row>
  );
};

export default Auth;

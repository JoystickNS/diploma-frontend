import LogoutOutlined from "@ant-design/icons/lib/icons/LogoutOutlined";
import { Col, Dropdown, Menu, Row } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import { RouteName } from "../../../constants/routes";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { api } from "../../../services/api";
import { useLogoutMutation } from "../../../services/auth/auth.service";
import { logoutAction } from "../../../store/slices/auth/auth.slice";
import Logo from "../../simple/Logo/Logo";
import s from "./AppHeader.module.scss";

const AppHeader: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [
    logoutAPI,
    { isLoading: logoutAPIIsLoading, isError: logoutAPIIsError },
  ] = useLogoutMutation();

  const logoutHandler = async () => {
    await logoutAPI();
    if (!logoutAPIIsError) {
      dispatch(logoutAction());
      dispatch(api.util.resetApiState());
    }
  };

  const menu = (
    <Menu>
      <Menu.Item
        disabled={logoutAPIIsLoading}
        onClick={() => logoutHandler()}
        danger
        key="0"
        icon={<LogoutOutlined />}
      >
        Выйти
      </Menu.Item>
    </Menu>
  );
  return (
    <Row align="middle" wrap={false} gutter={50}>
      <Col>
        <Logo></Logo>
      </Col>
      <Col xs={{ span: 0 }} md={{ span: 15 }}>
        <div className={s.site}>
          <div className={s.journalName}>Электронный журнал</div>
          <h1 className={s.siteName}>
            Ухтинский государственный технический университет
          </h1>
        </div>
      </Col>
      <Col xs={{ span: 0 }} md={{ span: 1 }}>
        <div className={s.authorization}>
          {user ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <span className={s.login}>{user.login}</span>
            </Dropdown>
          ) : (
            <Link to={RouteName.Login}>Авторизуйтесь</Link>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default AppHeader;

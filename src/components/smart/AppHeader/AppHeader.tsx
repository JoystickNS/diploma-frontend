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
    <Col
      style={{ marginTop: 25 }}
      xs={{ span: 24 }}
      xxl={{ offset: 5, span: 14 }}
    >
      <Row align="middle" gutter={[24, 24]} justify="center">
        <Col>
          <Logo></Logo>
        </Col>
        <Col
          xs={{ span: 0 }}
          md={{ span: 14 }}
          lg={{ span: 12 }}
          xxl={{ span: 15 }}
        >
          <div className={s.site}>
            <div>
              <span className={s.journalName}>Электронный журнал</span>
              <h1 className={s.siteName}>
                Ухтинский государственный технический университет
              </h1>
            </div>
          </div>
        </Col>
        <Col>
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
    </Col>
  );
};

export default AppHeader;

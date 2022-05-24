import { FC } from "react";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import { Outlet } from "react-router-dom";
import AppHeader from "../../smart/AppHeader/AppHeader";
import "../../../App.scss";
import { Col, Row } from "antd";

const AppLayout: FC = () => {
  return (
    <Layout className="layout">
      <Header className="header">
        <AppHeader />
      </Header>
      <Content className="content">
        <Row justify="center">
          <Col span={22}>
            <Outlet />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AppLayout;

import { Tabs } from "antd";
import { FC } from "react";
import UsersWithRoles from "../../components/smart/UsersWithRoles/UsersWithRoles";

const { TabPane } = Tabs;

const Admin: FC = () => {
  return (
    <Tabs size="large">
      <TabPane tab="Пользователи" key="1">
        <UsersWithRoles />
      </TabPane>
      {/* <TabPane tab="Права доступа" key="2">
        <Permissions />
      </TabPane> */}
    </Tabs>
  );
};

export default Admin;

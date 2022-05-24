import { Row } from "antd";
import { FC } from "react";
import ObjectCard from "../../components/simple/ObjectCard/ObjectCard";
import { RouteName } from "../../constants/routes";

const Main: FC = () => {
  return (
    <Row justify="center" gutter={[12, 12]}>
      <ObjectCard name="Журналы" to={RouteName.Journals} />
      <ObjectCard name="Отчеты" to={RouteName.Reports} />
      <ObjectCard name="Админ" to={RouteName.Admin} />
    </Row>
  );
};

export default Main;

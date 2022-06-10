import { Row } from "antd";
import { FC } from "react";
import Can from "../../components/simple/Can/Can";
import ObjectCard from "../../components/simple/ObjectCard/ObjectCard";
import { ActionName, SubjectName } from "../../constants/permissions";
import { RouteName } from "../../constants/routes";

const Main: FC = () => {
  return (
    <Row justify="center" gutter={[12, 12]}>
      <Can I={ActionName.Read} a={SubjectName.Journal}>
        <ObjectCard name="Журналы" to={RouteName.Journals} />
      </Can>

      <Can I={ActionName.Read} a={SubjectName.Report}>
        <ObjectCard name="Отчеты" to={RouteName.Reports} />
      </Can>

      <Can I={ActionName.Read} a={SubjectName.Admin}>
        <ObjectCard name="Админ" to={RouteName.Admin} />
      </Can>
    </Row>
  );
};

export default Main;

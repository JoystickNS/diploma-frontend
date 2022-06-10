import { Button, Col, Empty, Input, Row, Space, Spin } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import Can from "../../components/simple/Can/Can";
import JournalCard from "../../components/simple/JournalCard/JournalCard";
import { ActionName, SubjectName } from "../../constants/permissions";
import { RouteName } from "../../constants/routes";
import {
  useGetJournalsListQuery,
  useGetMyJournalsListQuery,
} from "../../services/journals/journals.service";

const { Search } = Input;

const Journals: FC = () => {
  const { data: myJournalsData, isFetching: isMyJournalsDataFetching } =
    useGetMyJournalsListQuery();
  const { data: journalsData, isFetching: isJournalsDataFetching } =
    useGetJournalsListQuery({});

  return (
    <>
      {/* TODO: Сделать видимым только для Journal.Create */}

      {myJournalsData && myJournalsData.length > 0 && (
        <>
          <Row justify="center" align="middle">
            <Space size="large">
              <h2 style={{ paddingTop: "15px" }}>
                <Space>
                  <strong>Мои журналы</strong>
                  {isMyJournalsDataFetching && <Spin size="small" />}
                </Space>
              </h2>
              <Link to={`${RouteName.Journals}/create`}>
                <Button type="primary">Создать</Button>
              </Link>
            </Space>
          </Row>

          <Row justify="center" gutter={[12, 12]} style={{ paddingTop: 15 }}>
            {myJournalsData?.map((journal) => (
              <JournalCard
                id={journal.id}
                key={journal.id}
                discipline={journal.discipline}
                group={journal.group}
                semester={journal.semester}
              />
            ))}
          </Row>
        </>
      )}
      {myJournalsData?.length === 0 && (
        <Empty
          description="Нет журналов"
          children={
            <Link to={`${RouteName.Journals}/create`}>
              <Button type="primary">Создать первый журнал</Button>
            </Link>
          }
        />
      )}
      {/* TODO: Сделать видимым только для MANAGER */}
      {/* <Can I={ActionName.Read} a={SubjectName.Report}>
        <Row justify="center" align="middle" style={{ marginTop: 24 }}>
          <h2 style={{ paddingTop: "15px" }}>
            <strong>Все журналы</strong>
          </h2>
          <Row>
            <Col>
              <Search
                placeholder="Найти журнал"
                onSearch={(value) => console.log(value)}
                enterButton
              />
            </Col>
          </Row>
          <Row justify="center" gutter={[12, 12]} style={{ paddingTop: 15 }}>
            {journalsData?.map((journal) => (
              <JournalCard
                id={journal.id}
                key={journal.id}
                discipline={journal.discipline}
                group={journal.group}
                semester={journal.semester}
              />
            ))}
          </Row>
        </Row>
      </Can> */}
    </>
  );
};

export default Journals;

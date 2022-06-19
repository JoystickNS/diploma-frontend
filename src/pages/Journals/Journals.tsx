import {
  Button,
  Col,
  Divider,
  Empty,
  message,
  Pagination,
  Row,
  Select,
  Spin,
  Tabs,
} from "antd";
import { FC, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Can from "../../components/simple/Can/Can";
import JournalCard from "../../components/simple/JournalCard/JournalCard";
import CSVReader from "../../components/smart/CSVReaderBasicUpload/CSVReaderBasicUpload";
import { ActionName, SubjectName } from "../../constants/permissions";
import { RouteName } from "../../constants/routes";
import { useGetGroupsQuery } from "../../services/groups/groups.service";
import {
  useGetAllJournalsListQuery,
  useGetMyJournalsListQuery,
} from "../../services/journals/journals.service";

const { TabPane } = Tabs;
const { Option } = Select;

const Journals: FC = () => {
  const [myJournalsGroupId, setMyJournalsGroupIdGroupId] = useState<
    number | undefined
  >(undefined);
  const [allJournalsGroupId, setAllJournalsGroupIdGroupId] = useState<
    number | undefined
  >(undefined);

  const [allJournalPage, setPage] = useState<number>(1);
  const [allJournalsSkip, setSkip] = useState<number>(0);
  const [allJournalsTake, setTake] = useState<number>(10);

  const { data: groupsData = [] } = useGetGroupsQuery();

  const [importMessage, setImportMessage] = useState<string>("");

  const {
    data: myJournalsData,
    isLoading: isMyJournalsDataLoading,
    isFetching: isMyJournalsDataFetching,
  } = useGetMyJournalsListQuery({ groupId: myJournalsGroupId });

  const {
    data: allJournalsData,
    isLoading: isJournalsDataLoading,
    isFetching: isJournalsDataFetching,
  } = useGetAllJournalsListQuery({
    groupId: allJournalsGroupId,
    skip: allJournalsSkip,
    take: allJournalsTake,
  });

  useEffect(() => {
    if (importMessage) {
      message.info(importMessage);
      setImportMessage("");
    }
  }, [importMessage]);

  const handleMyJournalsGroupChange = (value: number) => {
    if (value !== 0) {
      setMyJournalsGroupIdGroupId(value);
    } else {
      setMyJournalsGroupIdGroupId(undefined);
    }
  };

  const handleAllJournalsGroupChange = (value: number) => {
    if (value !== 0) {
      setAllJournalsGroupIdGroupId(value);
    } else {
      setAllJournalsGroupIdGroupId(undefined);
    }
  };

  const handleAllJournalsPageChange = (page: number) => {
    setPage(page);
    setSkip(page * allJournalsTake - allJournalsTake);
  };

  const handleAllJournalsPageSizeChange = (current: number, size: number) => {
    setTake(size);
  };

  const myActiveJournals = useMemo(
    () => myJournalsData?.items.filter((journal) => !journal.deleted),
    [myJournalsData]
  );

  const myDeletedJournals = useMemo(
    () => myJournalsData?.items.filter((journal) => journal.deleted),
    [myJournalsData]
  );

  return (
    <>
      {isMyJournalsDataLoading || isJournalsDataLoading ? (
        <Row justify="center">
          <Spin />
        </Row>
      ) : (
        <>
          {
            <Can I={ActionName.Create} a={SubjectName.Journal}>
              <Row justify="center" align="middle" gutter={[12, 12]}>
                <Col xs={{ span: 24 }}>
                  <h2 style={{ textAlign: "center" }}>
                    <strong>Мои журналы</strong>
                  </h2>
                </Col>

                <Col xs={{ span: 24 }}>
                  <Link to={`${RouteName.Journals}/create`}>
                    <Button type="primary">Создать</Button>
                  </Link>
                </Col>

                <Col xs={{ span: 24 }}>
                  <CSVReader setMessage={setImportMessage} />
                </Col>

                <Row justify="center" style={{ width: "100%" }}>
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 10 }}>
                    <Select
                      showSearch
                      placeholder="Группа"
                      style={{ width: "100%" }}
                      optionFilterProp="label"
                      defaultValue={0}
                      loading={isMyJournalsDataFetching}
                      onChange={handleMyJournalsGroupChange}
                    >
                      <Option key={0} value={0} label="Все группы">
                        Все группы
                      </Option>
                      {groupsData.map((group) => (
                        <Option
                          key={group.id}
                          value={group.id}
                          label={group.name}
                        >
                          {group.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Row>

              <Tabs size="large" style={{ width: "100%" }}>
                <TabPane tab="Активные" key="1">
                  <Row
                    justify="center"
                    gutter={[12, 12]}
                    style={{ paddingTop: 15 }}
                  >
                    {myActiveJournals && myActiveJournals.length > 0 ? (
                      myActiveJournals.map((journal) => (
                        <JournalCard
                          id={journal.id}
                          key={journal.id}
                          discipline={journal.discipline}
                          group={journal.group}
                          semester={journal.semester}
                        />
                      ))
                    ) : (
                      <Empty description="Нет журналов" />
                    )}
                  </Row>
                </TabPane>

                <TabPane tab="Удалённые (скрытые)" key="2">
                  <Row
                    justify="center"
                    gutter={[12, 12]}
                    style={{ paddingTop: 15 }}
                  >
                    {myDeletedJournals && myDeletedJournals.length > 0 ? (
                      myDeletedJournals.map((journal) => (
                        <JournalCard
                          id={journal.id}
                          key={journal.id}
                          discipline={journal.discipline}
                          group={journal.group}
                          semester={journal.semester}
                        />
                      ))
                    ) : (
                      <Empty description="Нет журналов" />
                    )}
                  </Row>
                </TabPane>
              </Tabs>
              <Divider />
            </Can>
          }

          <Can I={ActionName.Read} a={SubjectName.Report}>
            <Row justify="center" align="middle" gutter={[12, 12]}>
              <Col xs={{ span: 24 }}>
                <h2 style={{ textAlign: "center" }}>
                  <strong>Все журналы</strong>
                </h2>
              </Col>

              <Row justify="center" style={{ width: "100%" }}>
                <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 10 }}>
                  <Select
                    showSearch
                    placeholder="Группа"
                    style={{ width: "100%" }}
                    optionFilterProp="label"
                    defaultValue={0}
                    loading={isJournalsDataFetching}
                    onChange={handleAllJournalsGroupChange}
                  >
                    <Option key={0} value={0} label="Все группы">
                      Все группы
                    </Option>
                    {groupsData.map((group) => (
                      <Option
                        key={group.id}
                        value={group.id}
                        label={group.name}
                      >
                        {group.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Row>

            <Row justify="center" gutter={[12, 12]} style={{ paddingTop: 15 }}>
              {allJournalsData && allJournalsData?.totalCount > 0 ? (
                allJournalsData.items.map((journal) => (
                  <JournalCard
                    id={journal.id}
                    key={journal.id}
                    discipline={journal.discipline}
                    group={journal.group}
                    semester={journal.semester}
                    user={journal.user}
                  />
                ))
              ) : (
                <Empty description="Нет журналов" />
              )}
            </Row>

            <Row justify="center" style={{ marginTop: 24 }}>
              <Pagination
                current={allJournalPage}
                pageSize={allJournalsTake}
                showSizeChanger={true}
                total={allJournalsData?.totalCount}
                onChange={handleAllJournalsPageChange}
                onShowSizeChange={handleAllJournalsPageSizeChange}
              />
            </Row>
          </Can>
        </>
      )}
    </>
  );
};

export default Journals;

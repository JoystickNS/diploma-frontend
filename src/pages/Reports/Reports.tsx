import { Button, Col, Form, Row, Select } from "antd";
import { FC } from "react";
import { useGetGroupsQuery } from "../../services/groups/groups.service";

const { Option } = Select;

const Reports: FC = () => {
  const { data: groupsData, isLoading: isGroupsDataLoading } =
    useGetGroupsQuery();

  return (
    <Row justify="center" align="middle">
      <Col span={24}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          <strong>Формирование отчёта</strong>
        </h2>
      </Col>

      <Col span={8}>
        <Form layout="vertical">
          <Form.Item name="groupId">
            <Select
              showSearch
              placeholder="Выберите группу"
              loading={isGroupsDataLoading}
              optionFilterProp="label"
            >
              {groupsData?.map((group) => (
                <Option key={group.id} value={group.id} label={group.name}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="semester">
            <Select
              showSearch
              placeholder="Выберите семестр"
              loading={isGroupsDataLoading}
              optionFilterProp="label"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <Option key={i} value={i}>
                  {i}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row justify="center">
            <Button type="primary">Сформировать</Button>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default Reports;

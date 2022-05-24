import { Button, Row, Select, Space, Table } from "antd";
import { FC } from "react";

const { Option } = Select;

const EditSubgroups: FC = () => {
  const dataSource = [
    {
      key: 1,
      studentName: "Сергей",
      subgroup: 1,
    },
    {
      key: 2,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 3,
      studentName: "Сергей",
      subgroup: 1,
    },
    {
      key: 4,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 5,
      studentName: "Сергей",
      subgroup: 1,
    },
    {
      key: 6,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 7,
      studentName: "Сергей",
      subgroup: 1,
    },
    {
      key: 8,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 9,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 10,
      studentName: "Сергей",
      subgroup: 1,
    },
    {
      key: 11,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 12,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 13,
      studentName: "Сергей",
      subgroup: 1,
    },
    {
      key: 14,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 15,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 16,
      studentName: "Саша",
      subgroup: 1,
    },
    {
      key: 17,
      studentName: "Сергей",
      subgroup: 1,
    },
    {
      key: 18,
      studentName: "Саша",
      subgroup: 1,
    },
  ];

  const columns = [
    {
      title: "ФИО студента",
      dataIndex: "studentName",
    },
    {
      title: "№ подгруппы",
      dataIndex: "subgroup",
    },
  ];

  return (
    <>
      <Space direction="vertical">
        <Button>Разделить поровну на 2 подгруппы</Button>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          sticky
          scroll={{ y: window.screen.availHeight - 400 }}
        ></Table>
      </Space>
    </>
  );
};

export default EditSubgroups;

import { SettingOutlined } from "@ant-design/icons";
import { Col, Space, Checkbox, Select, Button, Modal, Table } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { ColumnsType } from "antd/lib/table";
import { FC, memo, useState } from "react";
import { ILessonSettings } from "../LessonDays.interface";
import { LessonDayProps } from "./LessonDay.interface";
import s from "./LessonDay.module.scss";

const { Option } = Select;

interface ICouplesSettingsTable extends ILessonSettings {
  key: number;
}

const LessonDay: FC<LessonDayProps> = ({ active, setActive }) => {
  const { couplesCount, isActive } = active;

  const [isSettingsModalVisible, setIsSettingsModalVisible] =
    useState<boolean>(false);

  const handleCouplesCountChange = (value: number) => {
    setActive({
      ...active,
      couplesCount: value,
      couples: Array(value)
        .fill(value)
        .map(() => ({
          isOnePerTwoWeeks: false,
          startWeek: 1,
        })),
    });
  };

  const handleIsOnePerTwoWeeksCouplesSettingsChange = (
    key: number,
    value: boolean
  ) => {
    const temp = [...active.couples];
    temp[key].isOnePerTwoWeeks = value;
    setActive({ ...active, couples: temp });
  };

  const handleStartWeekCouplesSettingsChange = (key: number, value: number) => {
    const temp = [...active.couples];
    temp[key].startWeek = value;
    setActive({ ...active, couples: temp });
  };

  const handleOnOkCouplesSettings = () => {
    setIsSettingsModalVisible(false);
  };

  const columns: ColumnsType<ICouplesSettingsTable> = [
    {
      title: "№ пары",
      key: "coupleNumber",
      dataIndex: "coupleNumber",
      align: "center",
    },
    {
      title: "Один раз в 2 недели",
      key: "isOnePerTwoWeeks",
      dataIndex: "isOnePerTwoWeeks",
      align: "center",
      render: (_: any, record: ICouplesSettingsTable) => (
        <Checkbox
          checked={active.couples[record.key].isOnePerTwoWeeks}
          onChange={(e: CheckboxChangeEvent) =>
            handleIsOnePerTwoWeeksCouplesSettingsChange(
              record.key,
              e.target.checked
            )
          }
        />
      ),
    },
    {
      title: "Начиная с недели",
      key: "startWeek",
      dataIndex: "startWeek",
      align: "center",
      render: (_: any, record: ICouplesSettingsTable) => {
        return (
          <Select
            size="small"
            disabled={!record.isOnePerTwoWeeks}
            value={active.couples[record.key].startWeek}
            onChange={(value: number) =>
              handleStartWeekCouplesSettingsChange(record.key, +value)
            }
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        );
      },
    },
  ];

  const dataSource: ICouplesSettingsTable[] = [
    ...active.couples.map((couple, i) => ({
      key: i,
      coupleNumber: i + 1,
      ...couple,
    })),
  ];

  return (
    <Col style={{ textAlign: "center" }}>
      <Space direction="vertical">
        <Col
          span={24}
          className={s.dayBlock}
          onClick={() => setActive({ ...active, isActive: !isActive })}
          style={{ backgroundColor: isActive ? "green" : "gray" }}
        >
          {active.day?.toUpperCase()}
        </Col>
        <Select
          size="small"
          defaultValue={1}
          disabled={!isActive}
          onChange={(value: number) => handleCouplesCountChange(+value)}
          value={couplesCount}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Option key={i} value={i}>
              {i}
            </Option>
          ))}
        </Select>
        <Button
          style={{ padding: 0 }}
          disabled={!isActive}
          type="link"
          size="small"
          onClick={() => setIsSettingsModalVisible(true)}
        >
          <SettingOutlined />
        </Button>
        <Modal
          title={`Настройка для ${active.day}`}
          centered
          maskClosable={false}
          visible={isSettingsModalVisible}
          onCancel={() => setIsSettingsModalVisible(false)}
          onOk={handleOnOkCouplesSettings}
        >
          <Table<ICouplesSettingsTable>
            bordered
            columns={columns}
            size="small"
            dataSource={dataSource}
            pagination={false}
          />
        </Modal>
      </Space>
    </Col>
  );
};

export default memo(LessonDay);

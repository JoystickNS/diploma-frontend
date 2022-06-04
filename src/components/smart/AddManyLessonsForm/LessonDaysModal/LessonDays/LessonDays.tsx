import { SettingOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Row, Space } from "antd";
import _ from "lodash";
import { FC, useState } from "react";
import LessonDay from "./LessonDay/LessonDay";
import { ILessonDay, LessonDaysProps } from "./LessonDays.interface";

const defaultActive: ILessonDay = {
  couplesCount: 1,
  couples: [
    {
      isOnePerTwoWeeks: false,
      startWeek: 1,
    },
  ],
  isActive: false,
};

const LessonDays: FC<LessonDaysProps> = ({ onCancel, onOk }) => {
  const [suActive, setSuActive] = useState<ILessonDay>({
    day: "пн",
    ..._.cloneDeep(defaultActive),
  });
  const [moActive, setMoActive] = useState<ILessonDay>({
    day: "вт",
    ..._.cloneDeep(defaultActive),
  });
  const [tuActive, setTuActive] = useState<ILessonDay>({
    day: "ср",
    ..._.cloneDeep(defaultActive),
  });
  const [weActive, setWeActive] = useState<ILessonDay>({
    day: "чт",
    ..._.cloneDeep(defaultActive),
  });
  const [thActive, setThActive] = useState<ILessonDay>({
    day: "пт",
    ..._.cloneDeep(defaultActive),
  });
  const [frActive, setFrActive] = useState<ILessonDay>({
    day: "сб",
    ..._.cloneDeep(defaultActive),
  });

  const handleOk = () => {
    const result: ILessonDay[] = [];

    if (suActive.isActive) {
      result.push(suActive);
    }
    if (moActive.isActive) {
      result.push(moActive);
    }
    if (tuActive.isActive) {
      result.push(tuActive);
    }
    if (weActive.isActive) {
      result.push(weActive);
    }
    if (thActive.isActive) {
      result.push(thActive);
    }
    if (frActive.isActive) {
      result.push(frActive);
    }

    onOk(result);
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Space direction="vertical">
            <Col>День недели</Col>
            <Col>Количество пар</Col>
          </Space>
        </Col>
        <Col span={16}>
          <Space align="baseline">
            <LessonDay active={suActive} setActive={setSuActive} />
            <LessonDay active={moActive} setActive={setMoActive} />
            <LessonDay active={tuActive} setActive={setTuActive} />
            <LessonDay active={weActive} setActive={setWeActive} />
            <LessonDay active={thActive} setActive={setThActive} />
            <LessonDay active={frActive} setActive={setFrActive} />
          </Space>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Alert
          message={
            <>
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "green",
                  display: "inline-block",
                }}
              ></div>
              <span> - выбрано</span>
              <div></div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "gray",
                  display: "inline-block",
                }}
              ></div>
              <span> - не выбрано</span>
              <div></div>
              <SettingOutlined style={{ fontSize: 10, color: "#1890ff" }} />
              <span> - настроить числитель/знаменатель</span>
            </>
          }
          type="info"
          showIcon
          style={{ width: "100%" }}
        />
      </Row>

      <Row justify="end" style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={onCancel}>Отмена</Button>
          <Button type="primary" onClick={handleOk}>
            Подтвердить
          </Button>
        </Space>
      </Row>
    </>
  );
};

export default LessonDays;

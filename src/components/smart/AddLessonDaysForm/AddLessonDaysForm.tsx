import { ExclamationOutlined } from "@ant-design/icons";
import { Form, Row, Col, Button, DatePicker, Space, Alert, Select } from "antd";
import moment from "moment";
import { FC, useRef, useState } from "react";
import { LABORATORY, LECTURE, PRACTICE } from "../../../constants/lessons";
import { ILesson } from "../../../models/ILesson";
import { ISubgroup } from "../../../models/ISubgroup";
import { IUpdateLessonArgs } from "../../../services/lessons/lessons.interface";
import { useUpdateManyLessonsMutation } from "../../../services/lessons/lessons.service";
import { rules } from "../../../utils/rules";
import { AddLessonDaysFormProps } from "./AddLessonDaysForm.interface";
import { ILessonDay } from "./LessonDaysModal/LessonDays/LessonDays.interface";
import LessonDaysModal from "./LessonDaysModal/LessonDaysModal";

const { Option } = Select;

const ALL_SUBGROUPS = "Все подгруппы";

const calcAvailableLessonsCount = (
  maxLessonsCount: number,
  subgroups: ISubgroup[],
  lessons: ILesson[],
  lessonType: string
) => {
  if (subgroups.length > 1) {
    return (
      maxLessonsCount -
      lessons.filter((lesson) => lesson.subgroups.length > 1).length
    );
  }

  return (
    maxLessonsCount -
    lessons.filter(
      (lesson) =>
        lesson.subgroups.includes(subgroups[0]) &&
        lesson.topic.type.name === lessonType
    ).length
  );
};

const AddLessonDaysForm: FC<AddLessonDaysFormProps> = ({
  lessons,
  maxLecturesCount,
  maxPracticesCount,
  maxLaboratoriesCount,
  subgroups,
  setIsModalVisible,
}) => {
  const [isLecturesModalVisible, setIsLecturesModalVisible] =
    useState<boolean>(false);
  const [isPracticeModalVisible, setIsPracticeModalVisible] =
    useState<boolean>(false);
  const [isLaboratoryModalVisible, setIsLaboratoryModalVisible] =
    useState<boolean>(false);

  const [lectureDays, setLectureDays] = useState<ILessonDay[]>([]);
  const [practiceDays, setPracticeDays] = useState<ILessonDay[]>([]);
  const [laboratoryDays, setLaboratoryDays] = useState<ILessonDay[]>([]);

  const [selectedSubgroup, setSelectedSubgroup] =
    useState<string>(ALL_SUBGROUPS);

  const [availableLecturesCount, setAvailableLecturesCount] = useState<number>(
    calcAvailableLessonsCount(maxLecturesCount, subgroups, lessons, LECTURE)
  );
  const [availablePracticesCount, setAvailablePracticesCount] =
    useState<number>(
      calcAvailableLessonsCount(maxPracticesCount, subgroups, lessons, PRACTICE)
    );
  const [availableLaboratoriesCount, setAvailableLaboratoriesCount] =
    useState<number>(
      calcAvailableLessonsCount(
        maxPracticesCount,
        subgroups,
        lessons,
        LABORATORY
      )
    );

  const lecturesBtRef = useRef<HTMLButtonElement>(null);
  const practiceBtRef = useRef<HTMLButtonElement>(null);
  const laboratoryBtRef = useRef<HTMLButtonElement>(null);

  const [updateManyLessonsAPI, { isLoading: isUpdateManyLessonsLoading }] =
    useUpdateManyLessonsMutation();

  const handleSubgroupChange = (value: string) => {
    console.log(value);
    if (value === ALL_SUBGROUPS) {
      setSelectedSubgroup(ALL_SUBGROUPS);

      setAvailableLecturesCount(
        maxLecturesCount -
          lessons.filter((lesson) => lesson.subgroups.length > 1).length
      );
    } else {
      const subgroup = subgroups.find(
        (subgroup) => subgroup.number.value === +value
      );

      if (subgroup) {
        setAvailablePracticesCount(
          maxPracticesCount -
            lessons.filter(
              (lesson) =>
                lesson.subgroups.includes(subgroup) &&
                lesson.topic.type.name === PRACTICE
            ).length
        );
        setAvailableLaboratoriesCount(
          maxLaboratoriesCount -
            lessons.filter(
              (lesson) =>
                lesson.subgroups.includes(subgroup) &&
                lesson.topic.type.name === LABORATORY
            ).length
        );
        setSelectedSubgroup(subgroup.number.value.toString());
      }
    }
  };

  // console.log("Lectures", availableLecturesCount);
  // console.log("Practices", availablePracticesCount);
  // console.log("Laboratories", availableLaboratoriesCount);
  // console.log("selectedSubgroup", selectedSubgroup);

  const onFinish = async (values: any) => {
    const date: moment.Moment = values.date.clone();

    const availableLectures = calcAvailableLessons(lessons, LECTURE);
    const availablePractices = calcAvailableLessons(lessons, PRACTICE);
    const availableLaboratories = calcAvailableLessons(lessons, LABORATORY);

    const lectureDates = calcLessonsDates(
      lectureDays,
      availableLectures.length,
      date
    );
    const practiceDates = calcLessonsDates(
      practiceDays,
      availablePractices.length,
      date
    );
    const laboratoryDates = calcLessonsDates(
      laboratoryDays,
      availableLaboratories.length,
      date
    );

    if (
      lectureDates.length > 0 ||
      practiceDates.length > 0 ||
      laboratoryDates.length > 0
    ) {
      const result: IUpdateLessonArgs[] = [
        ...lectureDates.map((lectureDate, i) => ({
          id: availableLectures[i].id,
          date: lectureDate,
        })),
        ...practiceDates.map((practiceDate, i) => ({
          id: availablePractices[i].id,
          date: practiceDate,
        })),
        ...laboratoryDates.map((laboratoryDate, i) => ({
          id: availableLaboratories[i].id,
          date: laboratoryDate,
        })),
      ];

      // await updateManyLessonsAPI({ items: result });
    }

    setIsModalVisible(false);
  };

  return (
    <>
      <Form labelCol={{ span: 5 }} onFinish={onFinish}>
        <Row>
          {subgroups.length > 1 && (
            <Col span={24}>
              <Form.Item label={"Подгруппа"} colon={false}>
                <Select
                  onChange={handleSubgroupChange}
                  value={selectedSubgroup}
                >
                  <>
                    <Option key={ALL_SUBGROUPS}>{ALL_SUBGROUPS}</Option>
                    {subgroups.map((subgroup) => (
                      <Option key={subgroup.number.value}>
                        {subgroup.number.value}
                      </Option>
                    ))}
                  </>
                </Select>
              </Form.Item>
            </Col>
          )}
          {availableLecturesCount > 0 && selectedSubgroup === ALL_SUBGROUPS && (
            <Col span={24}>
              <Form.Item label={LECTURE} colon={false}>
                <Button
                  onClick={() => setIsLecturesModalVisible(true)}
                  style={{ width: "100%" }}
                  ref={lecturesBtRef}
                >
                  Нажмите для добавления
                </Button>
                <LessonDaysModal
                  title="Дни лекций"
                  isModalVisible={isLecturesModalVisible}
                  setIsModalVisible={setIsLecturesModalVisible}
                  buttonRef={lecturesBtRef}
                  setDays={setLectureDays}
                />
              </Form.Item>
            </Col>
          )}

          {availablePracticesCount > 0 &&
            (selectedSubgroup !== ALL_SUBGROUPS || subgroups.length === 1) && (
              <Col span={24}>
                <Form.Item label={PRACTICE} colon={false}>
                  <Button
                    onClick={() => setIsPracticeModalVisible(true)}
                    style={{ width: "100%" }}
                    ref={practiceBtRef}
                  >
                    Нажмите для добавления
                  </Button>
                  <LessonDaysModal
                    title="Дни практик"
                    isModalVisible={isPracticeModalVisible}
                    setIsModalVisible={setIsPracticeModalVisible}
                    buttonRef={practiceBtRef}
                    setDays={setPracticeDays}
                  />
                </Form.Item>
              </Col>
            )}

          {availableLaboratoriesCount > 0 &&
            (selectedSubgroup !== ALL_SUBGROUPS || subgroups.length === 1) && (
              <Col span={24}>
                <Form.Item label={LABORATORY} colon={false}>
                  <Button
                    onClick={() => setIsLaboratoryModalVisible(true)}
                    style={{ width: "100%" }}
                    ref={laboratoryBtRef}
                  >
                    Нажмите для добавления
                  </Button>
                  <LessonDaysModal
                    title="Дни лабораторных"
                    isModalVisible={isLaboratoryModalVisible}
                    setIsModalVisible={setIsLaboratoryModalVisible}
                    buttonRef={laboratoryBtRef}
                    setDays={setLaboratoryDays}
                  />
                </Form.Item>
              </Col>
            )}

          <Col span={24}>
            <Form.Item
              label={"Дата начала"}
              colon={false}
              name="date"
              rules={[rules.required("Обязательное поле")]}
              initialValue={moment()}
            >
              <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Alert
            icon={<ExclamationOutlined style={{ color: "red" }} />}
            type="error"
            showIcon
            style={{ width: "100%" }}
            message="Внимание!"
            description="Занятия, которые должны пройти после сегодняшней даты будут удалены по типам занятий, которые вы добавляете!"
          />
        </Form.Item>

        <Row justify="end">
          <Space>
            <Button onClick={() => setIsModalVisible(false)}>Отменить</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdateManyLessonsLoading}
            >
              Добавить
            </Button>
          </Space>
        </Row>
      </Form>
    </>
  );
};

export default AddLessonDaysForm;

const calcLessonsStartDate = (
  day: ILessonDay,
  dayName: string,
  dayNum: number,
  date: moment.Moment
) => {
  const result: any = [];

  day.couples.forEach((i) => {
    const temp = {
      date: moment(),
      isOnePerTwoWeeks: false,
      isAddOnCurrentIteration: true,
    };
    if (i.isOnePerTwoWeeks) {
      const currentWeekDay = date.clone().startOf("w").add(dayNum, "d");
      temp.isOnePerTwoWeeks = true;
      switch (i.startWeek) {
        case 1:
          if (currentWeekDay.isBefore(date, "date")) {
            temp.date = currentWeekDay.add(1, "w");
          } else {
            temp.date = currentWeekDay;
          }
          break;

        case 2:
          temp.date = currentWeekDay.add(1, "w");
          break;
      }
    } else {
      const currentWeekDay = date.clone();
      while (currentWeekDay.format("ddd") !== dayName) {
        currentWeekDay.add(1, "d");
      }
      temp.date = currentWeekDay;
    }
    result.push(temp);
  });

  return result;
};

const calcLessonsDates = (
  lessonDays: ILessonDay[],
  lessonsCount: number,
  date: moment.Moment
): moment.Moment[] => {
  if (lessonDays.length === 0) {
    return [];
  }

  let lessonStartDates: any[] = [];
  const result: moment.Moment[] = [];

  lessonDays.forEach((day) => {
    switch (day.day) {
      case "пн":
        lessonStartDates.push(calcLessonsStartDate(day, "пн", 0, date));
        break;

      case "вт":
        lessonStartDates.push(calcLessonsStartDate(day, "вт", 1, date));
        break;

      case "ср":
        lessonStartDates.push(calcLessonsStartDate(day, "ср", 2, date));
        break;

      case "чт":
        lessonStartDates.push(calcLessonsStartDate(day, "чт", 3, date));
        break;

      case "пт":
        lessonStartDates.push(calcLessonsStartDate(day, "пт", 4, date));
        break;

      case "сб":
        lessonStartDates.push(calcLessonsStartDate(day, "сб", 5, date));
        break;
    }
  });

  while (lessonsCount > 0) {
    for (let lessonStartDate of lessonStartDates) {
      if (lessonsCount <= 0) {
        break;
      }

      for (let couple of lessonStartDate) {
        if (lessonsCount <= 0) {
          break;
        }

        const tempDate = couple.date.clone();
        if (couple.isOnePerTwoWeeks) {
          if (couple.isAddOnCurrentIteration) {
            result.push(tempDate);
            lessonsCount--;
            couple.isAddOnCurrentIteration = false;
          } else {
            couple.isAddOnCurrentIteration = true;
          }
          couple.date.add(1, "w");
        } else {
          result.push(tempDate);
          lessonsCount--;
          couple.date.add(1, "w");
        }
      }
    }
  }

  return result;
};

const calcAvailableLessons = (lessons: ILesson[], lessonType: string) => {
  return lessons.filter(
    (lesson) =>
      lesson.topic.type.name === lessonType &&
      (!lesson.date || moment(lesson.date) >= moment().add(1, "d"))
  );
};

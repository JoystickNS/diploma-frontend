import { ExclamationOutlined } from "@ant-design/icons";
import {
  Form,
  Row,
  Col,
  Button,
  DatePicker,
  Space,
  Alert,
  Select,
  Switch,
  message,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { FC, useEffect, useRef, useState } from "react";
import { ALL_SUBGROUPS } from "../../../constants/general";
import { LABORATORY, LECTURE, PRACTICE } from "../../../constants/lessons";
import { useAppDispatch } from "../../../hooks/redux";
import { IDictionary } from "../../../models/IDictionary";
import { ILesson } from "../../../models/ILesson";
import {
  useCreateManyLessonsMutation,
  useUpdateManyLessonsMutation,
} from "../../../services/lessons/lessons.service";
import {
  addManyLessonsAction,
  updateManyLessonsAction,
} from "../../../store/slices/journal/journal.slice";
import { rules } from "../../../utils/rules";
import { AddManyLessonsFormProps } from "./AddManyLessonsForm.interface";
import { ILessonDay } from "./LessonDaysModal/LessonDays/LessonDays.interface";
import LessonDaysModal from "./LessonDaysModal/LessonDaysModal";

const { Option } = Select;

const AddManyLessonsForm: FC<AddManyLessonsFormProps> = ({
  journalId,
  lessons,
  maxLecturesCount,
  maxPracticesCount,
  maxLaboratoriesCount,
  lessonTypes,
  subgroups,
  setIsModalVisible,
}) => {
  const dispatch = useAppDispatch();

  const [isLecturesModalVisible, setIsLecturesModalVisible] =
    useState<boolean>(false);
  const [isPracticeModalVisible, setIsPracticeModalVisible] =
    useState<boolean>(false);
  const [isLaboratoryModalVisible, setIsLaboratoryModalVisible] =
    useState<boolean>(false);

  const [isAllSubgroupsSelected, setIsAllSubgroupsSelected] =
    useState<boolean>(true);

  const [isUpdateCurrentLessons, setIsUpdateCurrentLessons] =
    useState<boolean>(false);

  const [lectureDays, setLectureDays] = useState<ILessonDay[]>([]);
  const [practiceDays, setPracticeDays] = useState<ILessonDay[]>([]);
  const [laboratoryDays, setLaboratoryDays] = useState<ILessonDay[]>([]);

  const lecturesBtRef = useRef<HTMLButtonElement>(null);
  const practiceBtRef = useRef<HTMLButtonElement>(null);
  const laboratoryBtRef = useRef<HTMLButtonElement>(null);

  const [createManyLessonsAPI, { isLoading: isCreateManyLessonsLoading }] =
    useCreateManyLessonsMutation();
  const [updateManyLessonsAPI, { isLoading: isUpdateManyLessonsLoading }] =
    useUpdateManyLessonsMutation();

  const [form] = useForm();

  useEffect(() => {
    setLectureDays([]);
    setPracticeDays([]);
    setLaboratoryDays([]);
    if (lecturesBtRef?.current) {
      lecturesBtRef.current.textContent = "Нажмите для добавления";
    }
    if (practiceBtRef?.current) {
      practiceBtRef.current.textContent = "Нажмите для добавления";
    }
    if (laboratoryBtRef?.current) {
      laboratoryBtRef.current.textContent = "Нажмите для добавления";
    }
  }, [subgroups]);

  const handleSubgroupChange = (value: number) => {
    if (value === 0) {
      setIsAllSubgroupsSelected(true);
    } else {
      setIsAllSubgroupsSelected(false);
    }
    setLectureDays([]);
    setPracticeDays([]);
    setLaboratoryDays([]);
  };

  const createLessons = (body: any) => {
    createManyLessonsAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(addManyLessonsAction(payload));
        setIsModalVisible(false);
      })
      .catch(() =>
        message.error("Произошла ошибка при формировании сетки занятий")
      );
  };

  const updateLessons = (body: any) => {
    updateManyLessonsAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(updateManyLessonsAction(payload));
        setIsModalVisible(false);
      })
      .catch(() =>
        message.error("Произошла ошибка при обновлении сетки занятий")
      );
  };

  const onFinish = async (values: any) => {
    let date: moment.Moment | undefined;

    if (!isUpdateCurrentLessons) {
      date = values.date.clone();
    }

    let subgroupIds: number[] = [];

    if (subgroups.length > 1) {
      if (values.subgroupIds === 0) {
        subgroupIds = subgroups.map((subgroup) => subgroup.id);
      } else {
        subgroupIds = [values.subgroupIds];
      }
    } else {
      subgroupIds = [subgroups[0].id];
    }

    const lectureLessons = calcLessons(
      isUpdateCurrentLessons,
      journalId,
      lessons,
      subgroupIds,
      lectureDays,
      LECTURE,
      lessonTypes,
      maxLecturesCount,
      date
    );
    const practiceLessons = calcLessons(
      isUpdateCurrentLessons,
      journalId,
      lessons,
      subgroupIds,
      practiceDays,
      PRACTICE,
      lessonTypes,
      maxPracticesCount,
      date
    );
    const laboratoryLessons = calcLessons(
      isUpdateCurrentLessons,
      journalId,
      lessons,
      subgroupIds,
      laboratoryDays,
      LABORATORY,
      lessonTypes,
      maxLaboratoriesCount,
      date
    );

    const body = {
      items: [
        ...lectureLessons.items,
        ...practiceLessons.items,
        ...laboratoryLessons.items,
      ],
    };

    if (body.items.length === 0) {
      setIsModalVisible(false);
      return;
    }

    isUpdateCurrentLessons ? updateLessons(body) : createLessons(body);
  };

  const isLectureVisible =
    maxLecturesCount > 0 && (isAllSubgroupsSelected || subgroups.length === 1);
  const isPracticeVisible =
    maxPracticesCount > 0 &&
    (!isAllSubgroupsSelected || subgroups.length === 1);
  const isLaboratoryVisible =
    maxLaboratoriesCount > 0 &&
    (!isAllSubgroupsSelected || subgroups.length === 1);
  const isButtonDisabled =
    lectureDays.length === 0 &&
    practiceDays.length === 0 &&
    laboratoryDays.length === 0;

  return (
    <>
      <Form form={form} labelCol={{ span: 9 }} onFinish={onFinish}>
        <Row>
          {subgroups.length > 1 && (
            <Col span={24}>
              <Form.Item
                label={"Подгруппа"}
                colon={false}
                name="subgroupIds"
                rules={[rules.required("Обязательное поле")]}
                initialValue={0}
              >
                <Select onChange={handleSubgroupChange}>
                  <>
                    <Option key={ALL_SUBGROUPS} value={0}>
                      {ALL_SUBGROUPS}
                    </Option>
                    {subgroups.map((subgroup) => (
                      <Option
                        key={subgroup.subgroupNumber.id}
                        value={subgroup.id}
                      >
                        {subgroup.subgroupNumber.value}
                      </Option>
                    ))}
                  </>
                </Select>
              </Form.Item>
            </Col>
          )}
          {isLectureVisible && (
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

          {isPracticeVisible && (
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

          {isLaboratoryVisible && (
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
            <Form.Item label="Обновить текущую сетку" colon={false}>
              <Switch
                checked={isUpdateCurrentLessons}
                onChange={() =>
                  setIsUpdateCurrentLessons(!isUpdateCurrentLessons)
                }
              />
            </Form.Item>
          </Col>

          {!isUpdateCurrentLessons && (
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
          )}
        </Row>

        <Form.Item>
          <Alert
            icon={<ExclamationOutlined style={{ color: "red" }} />}
            type="info"
            showIcon
            style={{ width: "100%" }}
            message="Внимание!"
            description={
              isUpdateCurrentLessons
                ? "Обновлены будут только те занятия, которые ещё не проведены!"
                : `Количество занятий, которое будет добавлено зависит от количества часов, 
                  которые вы указали для данного журнала, за вычетом количества уже проведённых часов!`
            }
          />
        </Form.Item>

        <Row justify="end">
          <Space>
            <Button onClick={() => setIsModalVisible(false)}>Отменить</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreateManyLessonsLoading || isUpdateManyLessonsLoading}
              disabled={isButtonDisabled}
            >
              Сформировать
            </Button>
          </Space>
        </Row>
      </Form>
    </>
  );
};

export default AddManyLessonsForm;

// Функция находит первые дни занятий
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
  if (lessonDays.length === 0 || lessonsCount <= 0) {
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

// Функция возвращает все занятия, по типу занятия и подгруппе
const calcAllLessons = (
  lessons: ILesson[],
  subgroupIds: number[],
  lessonType: string
) => {
  return lessons.filter(
    (lesson) =>
      lesson.lessonType.name === lessonType &&
      lesson.subgroups.length === subgroupIds.length &&
      lesson.subgroups.every((subgroup, i) => subgroup.id === subgroupIds[i])
  );
};

// Функция возвращает занятия, которые ещё не прошли, по типу занятия и подгруппе
const calcNotConductedLessons = (
  lessons: ILesson[],
  subgroupIds: number[],
  lessonType: string
) => {
  return lessons.filter(
    (lesson) =>
      !lesson.conducted &&
      lesson.lessonType.name === lessonType &&
      lesson.subgroups.every((subgroup, i) => subgroup.id === subgroupIds[i])
  );
};

// Функция возвращает дни, в которые будут проходить занятия
const calcLessons = (
  isUpdateLessons: boolean,
  journalId: number,
  lessons: ILesson[],
  subgroupIds: number[],
  lessonDays: ILessonDay[],
  lessonType: string,
  lessonTypes: IDictionary[],
  maxLessonsCount: number,
  date?: moment.Moment
) => {
  const result = { items: [] as any };

  const calcFunction = isUpdateLessons
    ? calcNotConductedLessons
    : calcAllLessons;

  const availableLessons = calcFunction(lessons, subgroupIds, lessonType);

  if (!date && availableLessons.length === 0) {
    return result;
  }

  const firstDate = date ? date : moment(availableLessons[0].date);

  const lessonsCount = isUpdateLessons
    ? availableLessons.length
    : maxLessonsCount - availableLessons.length;

  if (lessonDays.length === 0 || lessonsCount === 0) {
    return result;
  }

  let lessonDaysSorted: ILessonDay[] = [];

  const firstDateClone = firstDate.clone();
  const firstDateNumber = firstDateClone.day();

  if (firstDateNumber > 1) {
    const fondedLessonDay = lessonDays.find(
      (lessonDay) => lessonDay.day === firstDateClone.format("ddd")
    );
    if (fondedLessonDay) {
      lessonDaysSorted.push(fondedLessonDay);
    }
    firstDateClone.add(1, "d");
    while (firstDateClone.day() !== firstDateNumber) {
      const fondedLessonDay = lessonDays.find(
        (lessonDay) => lessonDay.day === firstDateClone.format("ddd")
      );
      if (fondedLessonDay) {
        lessonDaysSorted.push(fondedLessonDay);
      }
      firstDateClone.add(1, "d");
    }
  } else {
    lessonDaysSorted = lessonDays;
  }

  const lessonsDates = calcLessonsDates(
    lessonDaysSorted,
    lessonsCount,
    firstDate
  );

  const lessonTypeId =
    lessonTypes.find((item) => item.name === lessonType)?.id || -1;

  if (isUpdateLessons) {
    result.items = [
      ...lessonsDates.map((lessonDate, i) => ({
        lessonId: availableLessons[i].id,
        journalId: journalId,
        lessonTypeId,
        subgroupIds,
        date: lessonDate,
      })),
    ];
  } else {
    result.items = [
      ...lessonsDates.map((lessonDate) => ({
        journalId: journalId,
        lessonTypeId,
        subgroupIds,
        date: lessonDate,
      })),
    ];
  }

  return result;
};

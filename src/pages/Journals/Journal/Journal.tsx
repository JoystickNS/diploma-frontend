import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import { createContext, FC, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import AddItemButton from "../../../components/simple/AddItemButton/AddItemButton";
import DeleteButton from "../../../components/smart/DeleteButton/DeleteButton";
import { useGetJournalFullInfoQuery } from "../../../services/journals/journals.service";
import AddLessonDaysForm from "../../../components/smart/AddLessonDaysForm/AddLessonDaysForm";
import { useUpdateOneLessonMutation } from "../../../services/lessons/lessons.service";
import { EditableJournalHeaderCellProps } from "./Journal.interface";
import EditButton from "../../../components/smart/EditButton/EditButton";
import FormItem from "antd/lib/form/FormItem";
import { useGetWorkTypesQuery } from "../../../services/work-types/work-types.service";
import { rules } from "../../../utils/rules";
import { useForm } from "antd/lib/form/Form";
import { IAttestation } from "../../../models/IAttestation";
import { useUpdateAttestationMutation } from "../../../services/attestations/attestations.service";
import { ILesson } from "../../../models/ILesson";
import EditSubgroups from "../../../components/smart/EditSubgroups/EditSubgroups";

const { Option } = Select;
const { TextArea } = Input;

const EditableContext = createContext<FormInstance<any> | null>(null);

const EditableRow: FC = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const Journal: FC = () => {
  const { journalId } = useParams();

  const { data: journalFullInfoData, isLoading: isJournalFullInfoLoading } =
    useGetJournalFullInfoQuery(journalId ? +journalId : 0);
  const { data: workTypesData } = useGetWorkTypesQuery();

  const [updateOneLessonAPI, { isLoading: isUpdateOneLessonLoading }] =
    useUpdateOneLessonMutation();
  const [updateAttestationAPI, { isLoading: isUpdateAttestationLoading }] =
    useUpdateAttestationMutation();

  const [isAddLessonsModalVisible, setIsAddLessonsModalVisible] =
    useState<boolean>(false);
  const [isEditLessonModalVisible, setIsEditLessonModalVisible] =
    useState<boolean>(false);
  const [isEditAttestationModalVisible, setIsEditAttestationModalVisible] =
    useState<boolean>(false);
  const [isEditSubgroupsModalVisible, setIsEditSubgroupsModalVisible] =
    useState<boolean>(false);

  const [attestationEditForm] = useForm();
  const [lessonForm] = useForm();

  const handleDeleteLesson = (lessonId: number) => {
    updateOneLessonAPI({ id: lessonId, date: undefined });
  };

  const handleEditLesson = (lesson: ILesson) => {
    lessonForm.setFieldsValue({
      id: lesson.id,
      date: moment(lesson.date),
    });
    setIsEditLessonModalVisible(true);
  };

  const handleEditAttestation = (attestation: IAttestation) => {
    attestationEditForm.setFieldsValue({
      id: attestation.id,
      workType: attestation.workType,
      workTopic: attestation.workTopic,
      maximumPoints: attestation.maximumPoints,
    });
    setIsEditAttestationModalVisible(true);
  };

  const handleSaveAttestation = async () => {
    try {
      const values = await attestationEditForm.validateFields();

      updateAttestationAPI(values)
        .unwrap()
        .then(() => setIsEditAttestationModalVisible(false))
        .catch(() =>
          message.error(
            "Произошла ошибка при обновлении промежуточной аттестации"
          )
        );
    } catch (errInfo) {}
  };

  const EditableJournalHeaderCell: React.FC<EditableJournalHeaderCellProps> = ({
    id,
    title,
    isEditable,
    children,
    dataIndex,
    ...restProps
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = useContext(EditableContext)!;

    const toggleEdit = () => {
      setIsEditing(!isEditing);
      form.setFieldsValue({ [dataIndex]: title });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        let newValue = values.lessonTopic || values.workTopic;

        toggleEdit();
        newValue = newValue === undefined ? null : newValue;

        if (newValue === title) {
          return;
        }

        updateOneLessonAPI({ id, topic: newValue })
          .unwrap()
          .catch(() => message.error("Произошла ошибка при изменении темы"));
      } catch (errInfo) {}
    };

    let childNode = children;
    let inputNode = (
      <AutoComplete
        autoFocus
        size="small"
        style={{ width: "100%" }}
        placeholder="Введите тему занятия"
        onBlur={save}
        maxTagTextLength={250}
      />
    );

    if (isEditable) {
      childNode = isEditing ? (
        <Form.Item name={dataIndex} noStyle>
          {inputNode}
        </Form.Item>
      ) : (
        <div className="editable-header-cell-value-wrap" onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <th {...restProps}>{childNode}</th>;
  };

  const dataSource = [
    {
      key: "1",
      studentName: "Олег",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      studentName: "Сергей",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "3",
      studentName: "Павел",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "4",
      studentName: "Андрей",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns: any[] = [];

  columns.push({
    title: "ФИО студента",
    dataIndex: "studentName",
    fixed: "left",
    align: "center",
    width: "250px",
    isEditable: true,
    sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
    render: (text: string) => {
      const currentDate = "03.05.2022";
      return currentDate === text ? (
        <div style={{ backgroundColor: "red", textAlign: "left" }}>{text}</div>
      ) : (
        <div
          style={{
            wordWrap: "break-word",
            wordBreak: "break-word",
            textAlign: "left",
          }}
        >
          {text}
        </div>
      );
    },
  });

  if (journalFullInfoData?.lessons && journalFullInfoData.lessons.length > 0) {
    const lessonsWithDates = journalFullInfoData.lessons.filter(
      (lesson) => lesson.date !== null
    );

    if (lessonsWithDates.length > 0) {
      columns.push({
        title: "Занятия",
        dataIndex: "lessons",
        align: "center",
        children: [
          ...lessonsWithDates.map((lesson) => ({
            title: () => {
              const date = moment(lesson.date);
              const dayName = date.format("ddd");
              const today = moment();
              const lessonType =
                lesson.type === "Лекция"
                  ? "Лек."
                  : lesson.type === "Практика"
                  ? "Пр."
                  : "Лаб.";
              return (
                <Row
                  justify="space-between"
                  wrap={false}
                  align="middle"
                  style={{
                    color: date.isSame(today, "date") ? "green" : undefined, // FIXME: green
                  }}
                >
                  <Space>
                    {`${date.format("DD.MM.YYYY")} (${
                      dayName[0].toUpperCase() + dayName.slice(1)
                    })`}
                    <Tag
                      color={
                        lessonType === "Лек."
                          ? "orange"
                          : lessonType === "Пр."
                          ? "blue"
                          : "cyan"
                      }
                      style={{ margin: 0 }}
                    >
                      {lessonType}
                    </Tag>
                    <EditButton
                      onClick={() => {
                        handleEditLesson(lesson);
                      }}
                    />
                    <DeleteButton
                      onConfirm={() => handleDeleteLesson(lesson.id)}
                    />
                  </Space>
                  <AddItemButton tooltipText="Добавить колонку на эту дату" />
                </Row>
              );
            },
            dataIndex: lesson.date,
            children: [
              {
                title: lesson.topic,
                align: "center",
                isEditable: true,
                className: "editable-row",
                dataIndex: "lessonTopic",
                onHeaderCell: (col: any) => ({
                  id: lesson.id,
                  title: col.title,
                  isEditable: col.isEditable,
                  dataIndex: col.dataIndex,
                }),
                children: [
                  {
                    title: "Отсутствует",
                    dataIndex: "isAbsent",
                    align: "center",
                    width: "270px",
                    render: () => <Checkbox />,
                  },
                ],
              },
            ],
          })),
        ],
      });
    }
  }

  if (journalFullInfoData && journalFullInfoData?.attestations.length > 0) {
    columns.push({
      title: "Промежуточные аттестации",
      dataIndex: "attestations",
      align: "center",
      children: [
        ...journalFullInfoData.attestations.map((attestation) => ({
          title: () => {
            const title = attestation.maximumPoints
              ? `${attestation.workType} (макс. ${attestation.maximumPoints})`
              : attestation.workType;
            return (
              <Space>
                {title}
                <EditButton
                  onClick={() => handleEditAttestation(attestation)}
                />
              </Space>
            );
          },
          align: "center",
          children: attestation.workTopic
            ? [
                {
                  title: attestation.workTopic,
                  align: "center",
                  width: "400px",
                  dataIndex: "workTopic",
                },
              ]
            : null,
        })),
      ],
    });
  }

  columns.push({
    title: journalFullInfoData?.maximumPoints
      ? `Суммарный балл (макс. ${journalFullInfoData?.maximumPoints})`
      : "Суммарный балл",
    align: "center",
    sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
    width: "150px",
  });

  columns.push({
    title: journalFullInfoData?.control,
    align: "center",
    sorter: (a: any, b: any) => (a.control > b.control ? 1 : -1),
    width: "150px",
  });

  return (
    <>
      <Row align="middle" gutter={[24, 0]}>
        <Col>
          <h2>
            <strong>Дисциплина: </strong>
            {isJournalFullInfoLoading ? (
              <Spin size="small" />
            ) : (
              journalFullInfoData?.discipline
            )}
          </h2>
          <h2>
            <strong>Группа: </strong>
            {isJournalFullInfoLoading ? (
              <Spin size="small" />
            ) : (
              journalFullInfoData?.group
            )}
          </h2>
          <h2>
            <strong>Семестр: </strong>
            {isJournalFullInfoLoading ? (
              <Spin size="small" />
            ) : (
              journalFullInfoData?.semester
            )}
          </h2>
        </Col>

        {journalId && (
          <>
            <Col span={8}>
              <Space direction="vertical">
                <Button onClick={() => setIsAddLessonsModalVisible(true)}>
                  Добавить занятия
                </Button>
                <Button onClick={() => setIsEditSubgroupsModalVisible(true)}>
                  Редактирование подгрупп
                </Button>
              </Space>
            </Col>
            <Modal
              title="Добавить занятия"
              centered
              visible={isAddLessonsModalVisible}
              maskClosable={false}
              footer={null}
              onOk={() => setIsAddLessonsModalVisible(false)}
              onCancel={() => setIsAddLessonsModalVisible(false)}
            >
              <AddLessonDaysForm
                lessons={journalFullInfoData?.lessons || []}
                setIsModalVisible={setIsAddLessonsModalVisible}
                lecturesCount={
                  (journalFullInfoData &&
                    Math.ceil(journalFullInfoData?.lectureHours / 2)) ||
                  0
                }
                practicesCount={
                  (journalFullInfoData &&
                    Math.ceil(journalFullInfoData?.practiceHours / 2)) ||
                  0
                }
                laboratoriesCount={
                  (journalFullInfoData &&
                    Math.ceil(journalFullInfoData?.laboratoryHours / 2)) ||
                  0
                }
              />
            </Modal>
          </>
        )}
      </Row>

      <Table
        bordered
        sticky
        dataSource={dataSource}
        components={{
          header: {
            cell: EditableJournalHeaderCell,
            row: EditableRow,
          },
        }}
        rowClassName={() => "editable-row"}
        columns={columns}
        scroll={{ x: "max-context", y: window.screen.availHeight - 600 }}
        pagination={false}
        size="small"
        loading={isJournalFullInfoLoading || isUpdateOneLessonLoading}
      />

      <Modal
        centered
        title="Редактирование подгрупп"
        onCancel={() => setIsEditSubgroupsModalVisible(false)}
        maskClosable={false}
        visible={isEditSubgroupsModalVisible}
        cancelText={null}
        okText="Закрыть"
      >
        <EditSubgroups />
      </Modal>

      <Modal
        centered
        title="Редактирование занятия"
        onCancel={() => setIsEditLessonModalVisible(false)}
        onOk={() => handleSaveAttestation()}
        okButtonProps={{ loading: isUpdateOneLessonLoading }}
        maskClosable={false}
        visible={isEditLessonModalVisible}
        okText="Сохранить"
      >
        <Form form={lessonForm}>
          <FormItem name="id" style={{ display: "none" }} />

          <Form.Item
            label={"Дата занятия"}
            colon={false}
            name="date"
            rules={[rules.required("Обязательное поле")]}
          >
            <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered
        title="Редактирование промежуточной аттестации"
        onCancel={() => setIsEditAttestationModalVisible(false)}
        onOk={() => handleSaveAttestation()}
        okButtonProps={{ loading: isUpdateAttestationLoading }}
        maskClosable={false}
        visible={isEditAttestationModalVisible}
        okText="Сохранить"
      >
        <Form form={attestationEditForm}>
          <FormItem name="id" style={{ display: "none" }} />

          <FormItem name="workType" label="Тип работы" labelCol={{ span: 7 }}>
            <Select style={{ width: "100%" }}>
              {workTypesData?.map((workType) => (
                <Option key={workType.id} value={workType.name}>
                  {workType.name}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem name="workTopic" label="Тема работы" labelCol={{ span: 7 }}>
            <TextArea rows={3} maxLength={250} showCount />
          </FormItem>

          <FormItem
            name="maximumPoints"
            label="Максимум баллов"
            labelCol={{ span: 7 }}
            rules={[
              rules.pattern(
                /^\d{1,2}$|^$/,
                "Введите число или оставьте поле пустым"
              ),
            ]}
          >
            <Input maxLength={2} />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default Journal;

import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { createContext, FC, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AddItemButton from "../../../components/simple/AddItemButton/AddItemButton";
import DeleteButton from "../../../components/smart/DeleteButton/DeleteButton";
import { useGetJournalFullInfoQuery } from "../../../services/journals/journals.service";
import {
  useDeleteLessonMutation,
  useStartLessonMutation,
} from "../../../services/lessons/lessons.service";
import {
  IJournalTable,
  IStudentPoint,
  IStudentVisit,
} from "./Journal.interface";
import EditButton from "../../../components/smart/EditButton/EditButton";
import { useForm } from "antd/lib/form/Form";
import { IAttestation } from "../../../models/IAttestation";
import { useDeleteAttestationMutation } from "../../../services/attestations/attestations.service";
import { ILesson } from "../../../models/ILesson";
import EditSubgroups from "../../../components/smart/EditSubgroups/EditSubgroups";
import { useDispatch } from "react-redux";
import {
  deleteAttestationAction,
  deleteLessonAction,
  setJournalAction,
  startLessonAction,
  updateManySubgroupsStudentsAction,
} from "../../../store/slices/journal/journal.slice";
import { useAppSelector } from "../../../hooks/redux";
import { LECTURE, PRACTICE } from "../../../constants/lessons";
import { ISubgroup } from "../../../models/ISubgroup";
import AddManyLessonsForm from "../../../components/smart/AddManyLessonsForm/AddManyLessonsForm";
import AddLessonModal from "../../../components/smart/AddLessonModal/AddLessonModal";
import AddAttestationModal from "../../../components/smart/AddAttestationModal/AddAttestationModal";
import { useCreateSubgroupStudentMutation } from "../../../services/subgroups/subgroups.service";
import { IStudentSubgroup } from "../../../models/IStudentSubgroup";
import _ from "lodash";
import StartButton from "../../../components/smart/StartButton/StartButton";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

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

  const dispatch = useDispatch();
  const journal = useAppSelector((state) => state.journal);

  const {
    data: JournalFullInfo,
    isLoading: isJournalFullInfoLoading,
    isSuccess: isJournalFullInfoSuccess,
  } = useGetJournalFullInfoQuery(journalId ? +journalId : 0);

  const [
    createSubgroupStudentAPI,
    { isLoading: isCreateSubgroupStudentLoading },
  ] = useCreateSubgroupStudentMutation();
  const [startLessonAPI, { isLoading: isStartLessonLoading }] =
    useStartLessonMutation();
  const [deleteLessonAPI, { isLoading: isDeleteLessonLoading }] =
    useDeleteLessonMutation();
  const [deleteAttestationAPI, { isLoading: isDeleteAttestationLoading }] =
    useDeleteAttestationMutation();

  const [isAddOneLessonModalVisible, setIsAddLessonModalVisible] =
    useState<boolean>(false);
  const [isAddLessonsModalVisible, setIsAddLessonsModalVisible] =
    useState<boolean>(false);
  const [isAddAttestationModalVisible, setIsAddAttestationModalVisible] =
    useState<boolean>(false);
  const [isEditSubgroupsModalVisible, setIsEditSubgroupsModalVisible] =
    useState<boolean>(false);

  const [isAttestationEditing, setIsAttestationEditing] =
    useState<boolean>(false);
  const [isLessonEditing, setIsLessonEditing] = useState<boolean>(false);

  const [isSomeStudentWithoutSubgroup, setIsSomeStudentWithoutSubgroup] =
    useState<boolean>(false);

  const [attestationEditForm] = useForm();
  const [lessonForm] = useForm();

  interface a {
    dataIndex: string;
    record: any;
  }

  const EditableCell: React.FC<a> = ({
    children,
    dataIndex,
    record,
    ...restProps
  }) => {
    let childNode = children;

    if (dataIndex?.includes("isAbsent")) {
      const isAbsent = record[dataIndex];
      if (isAbsent?.isAbsent === false) {
        childNode = "н";
      }
    }

    return <td {...restProps}>{childNode}</td>;
  };

  useEffect(() => {
    if (isJournalFullInfoSuccess) {
      dispatch(setJournalAction(JournalFullInfo));
    }
  }, [isJournalFullInfoLoading]);

  useEffect(() => {
    (async () => {
      const result: IStudentSubgroup[] = [];
      const studentsWithoutSubgroup = journal.students.filter(
        (student) => !student.subgroup
      );

      if (journal.subgroups.length === 1) {
        await Promise.all(
          studentsWithoutSubgroup.map(async (student) =>
            createSubgroupStudentAPI({
              journalId: journal.id,
              studentId: student.id,
              subgroupId: journal.subgroups[0].id,
            })
              .unwrap()
              .then((payload) => result.push(payload))
              .catch(() =>
                message.error("Произошла ошибка при добавлении нового студента")
              )
          )
        );

        if (result.length > 0) {
          dispatch(updateManySubgroupsStudentsAction(result));
        }
      } else if (isSomeStudentWithoutSubgroup) {
        setIsSomeStudentWithoutSubgroup(false);
      }
    })();
  }, [journal.students, journal.subgroups]);

  const handleAddLesson = () => {
    lessonForm.setFieldsValue({
      subgroupIds: undefined,
      lessonTypeId: undefined,
      lessonTopic: undefined,
      date: moment(),
    });
    setIsLessonEditing(false);
    setIsAddLessonModalVisible(true);
  };

  const handleEditLesson = (lesson: ILesson) => {
    lessonForm.setFieldsValue({
      lessonId: lesson.id,
      subgroupIds: lesson.subgroups.length === 1 ? lesson.subgroups[0].id : 0,
      lessonTypeId: lesson.lessonType.id,
      lessonTopic: lesson.lessonTopic?.name,
      date: moment(lesson.date),
    });
    setIsLessonEditing(true);
    setIsAddLessonModalVisible(true);
  };

  const handleDeleteLesson = (lessonId: number, subgroups: ISubgroup[]) => {
    deleteLessonAPI({
      lessonId,
      journalId: journal.id,
      subgroupId: subgroups[0].id,
    })
      .unwrap()
      .then((payload) => dispatch(deleteLessonAction(payload.id)))
      .catch(() => message.error("Произошла ошибка при удалении занятия"));
  };

  const handleAddAttestation = () => {
    attestationEditForm.setFieldsValue({
      workType: undefined,
      workTopic: undefined,
      maximumPoints: undefined,
    });
    setIsAttestationEditing(false);
    setIsAddAttestationModalVisible(true);
  };

  const handleEditAttestation = (attestation: IAttestation) => {
    attestationEditForm.setFieldsValue({
      attestationId: attestation.id,
      workTypeId: attestation.workType?.id,
      workTopic: attestation.workTopic,
      maximumPoints: attestation.maximumPoints,
    });
    setIsAttestationEditing(true);
    setIsAddAttestationModalVisible(true);
  };

  const handleDeleteAttestation = (attestationId: number) => {
    deleteAttestationAPI({ journalId: journal.id, attestationId })
      .unwrap()
      .then((payload) => dispatch(deleteAttestationAction(payload.id)))
      .catch(() => message.error("Произошла ошибка при удалении аттестации"));
  };

  const handleStartLesson = (lesson: ILesson) => {
    startLessonAPI({
      journalId: journal.id,
      lessonId: lesson.id,
      subgroupIds: lesson.subgroups.map((subgroup) => subgroup.id),
    })
      .unwrap()
      .then((payload) => dispatch(startLessonAction(payload)))
      .catch(() =>
        message.error("Произошла ошибка при попытке начать занятие")
      );
  };

  const handleAbsentChange = (
    value: boolean,
    lessonId: number,
    studentId: number
  ) => {
    console.log(value);
    console.log(lessonId);
    console.log(studentId);
  };

  // const EditableJournalHeaderCell: React.FC<EditableJournalHeaderCellProps> = ({
  //   id,
  //   title,
  //   isEditable,
  //   children,
  //   dataIndex,
  //   lessonType,
  //   ...restProps
  // }) => {
  //   const [isEditing, setIsEditing] = useState(false);
  //   const form = useContext(EditableContext)!;

  //   const toggleEdit = () => {
  //     setIsEditing(!isEditing);
  //     form.setFieldsValue({ [dataIndex]: title });
  //   };

  //   const save = async () => {
  //     try {
  //       const values = await form.validateFields();
  //       let newValue = values.lessonTopic || values.workTopic;

  //       toggleEdit();
  //       newValue = newValue === undefined ? null : newValue;

  //       if (newValue === title) {
  //         return;
  //       }

  //       updateLessonAPI({ id, topic: newValue })
  //         .unwrap()
  //         .catch(() => message.error("Произошла ошибка при изменении темы"));
  //     } catch (errInfo) {}
  //   };

  //   let options: any[] = [];
  //   console.log(lessonType);
  //   switch (lessonType) {
  //     case LECTURE:
  //       options = calcAutocompleteOptions(journal.lessonTopics, LECTURE);
  //       break;

  //     case PRACTICE:
  //       options = calcAutocompleteOptions(journal.lessonTopics, PRACTICE);
  //       break;

  //     case LABORATORY:
  //       options = calcAutocompleteOptions(journal.lessonTopics, LABORATORY);
  //       break;
  //   }

  //   console.log(options);

  //   let childNode = children;
  //   let inputNode = (
  //     <AutoComplete
  //       autoFocus
  //       size="small"
  //       style={{ width: "100%" }}
  //       placeholder="Введите тему занятия"
  //       onBlur={save}
  //       options={options}
  //       filterOption={(inputValue, option) =>
  //         option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  //       }
  //     />
  //   );

  //   if (isEditable) {
  //     childNode = isEditing ? (
  //       <Form.Item
  //         name={dataIndex}
  //         noStyle
  //         rules={[rules.max(250, "Введите не более 250 символов")]}
  //       >
  //         {inputNode}
  //       </Form.Item>
  //     ) : (
  //       <Popover content={title}>
  //         <div className="editable-header-cell-value-wrap" onClick={toggleEdit}>
  //           {children}
  //         </div>
  //       </Popover>
  //     );
  //   }

  //   return <th {...restProps}>{childNode}</th>;
  // };

  const dataSource: IJournalTable[] = useMemo(
    () =>
      journal.students.map((student) => {
        const temp = {} as IJournalTable;

        temp.key = student.id;
        temp.studentName = `${student.lastName} ${student.firstName} ${student.middleName}`;
        temp.subgroup = student.subgroup;

        const studentVisits: IStudentVisit[] = [];
        const studentPoints: IStudentPoint[] = [];

        journal.lessons.forEach((lesson) => {
          const studentVisit = journal.visits.find(
            (visit) =>
              visit.studentId === student.id && visit.lessonId === lesson.id
          );
          const studentPoint = journal.points.find(
            (point) =>
              point.studentId === student.id && point.lessonId === lesson.id
          );
          if (studentVisit) {
            studentVisits.push({
              ...studentVisit,
              lessonId: lesson.id,
            });
          }
          if (studentPoint) {
            studentPoints.push({
              ...studentPoint,
              lessonId: lesson.id,
            });
          }
        });

        studentVisits.forEach(
          (studentVisit) =>
            (temp[`${studentVisit.lessonId} isAbsent`] = studentVisit)
        );

        studentPoints.forEach(
          (studentPoint) =>
            (temp[`${studentPoint.lessonId} isAbsent`] = studentPoint)
        );

        return temp;
      }),
    [journal]
  );

  console.log(dataSource);

  const columns: any[] = [];

  columns.push({
    title: "ФИО студента",
    dataIndex: "studentName",
    fixed: "left",
    align: "center",
    width: "250px",
    isEditable: true,
    sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
    render: (text: string, record: IJournalTable) => {
      const isSubgroup = record.subgroup || journal.subgroups.length === 1;
      return (
        <div style={{ textAlign: "left", color: isSubgroup ? "black" : "red" }}>
          {isSubgroup ? (
            text
          ) : (
            <Tooltip
              title={
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditSubgroupsModalVisible(true)}
                >
                  Не назначена подгруппа
                </div>
              }
              color="black"
            >
              {text}
            </Tooltip>
          )}
        </div>
      );
    },
  });

  if (journal.lessons.length > 0) {
    columns.push({
      title: "Занятия",
      align: "center",
      children: [
        ...journal.lessons.map((lesson) => ({
          title: () => {
            const date = moment(lesson.date);
            const dayName = date.format("ddd");
            const today = moment();
            const lessonType =
              lesson.lessonType.name === LECTURE
                ? "Лек."
                : lesson.lessonType.name === PRACTICE
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
                    onConfirm={() =>
                      handleDeleteLesson(lesson.id, lesson.subgroups)
                    }
                  />
                  {!lesson.conducted ? (
                    <StartButton
                      buttonSize={18}
                      tooltipText="Начать занятие"
                      onClick={() => handleStartLesson(lesson)}
                    />
                  ) : (
                    <Button>РЕДАКТ</Button>
                  )}
                </Space>
                <AddItemButton tooltipText="Добавить колонку на эту дату" />
              </Row>
            );
          },
          children: [
            {
              title: lesson.lessonTopic?.name || "Тема занятия отсутствует",
              align: "center",
              isEditable: true,
              className: "editable-row",
              dataIndex: "lessonTopic",
              // onHeaderCell: (col: any) => ({
              //   id: lesson.id,
              //   title: col.title,
              //   isEditable: col.isEditable,
              //   dataIndex: col.dataIndex,
              //   lessonType: lesson.lessonType.name,
              // }),
              children: [
                {
                  title: "Студент отсутствует",
                  dataIndex: `${lesson.id} isAbsent`,
                  align: "center",
                  width: "300px",
                  render: (text: string, record: IJournalTable) => {
                    return lesson.conducted
                      ? lesson.subgroups.find(
                          (lessonSubgroup) =>
                            lessonSubgroup.id === record.subgroup.id
                        ) && (
                          <Checkbox
                            checked={record[`${lesson.id} isAbsent`]?.isAbsent}
                            onChange={(e: CheckboxChangeEvent) =>
                              handleAbsentChange(
                                e.target.checked,
                                lesson.id,
                                record.key
                              )
                            }
                          />
                        )
                      : record[`${lesson.id} isAbsent`]?.isAbsent && "H";
                  },
                },
              ],
            },
          ],
        })),
      ],
    });
  }

  if (
    journal.attestations.filter((attestation) => attestation.workType !== null)
      .length > 0
  ) {
    columns.push({
      title: "Промежуточные аттестации",
      align: "center",
      children: [
        ...journal.attestations
          .filter((attestation) => attestation.workType)
          .map((attestation) => {
            return {
              title: () => {
                const title = attestation.maximumPoints
                  ? `${attestation.workType?.name} (макс. ${attestation.maximumPoints})`
                  : attestation.workType?.name;
                return (
                  <Space>
                    {title}
                    <EditButton
                      onClick={() => handleEditAttestation(attestation)}
                    />
                    <DeleteButton
                      onConfirm={() => handleDeleteAttestation(attestation.id)}
                    />
                  </Space>
                );
              },
              align: "center",
              children: [
                {
                  title: attestation.workTopic
                    ? attestation.workTopic
                    : "Тема аттестации отсутствует",
                  align: "center",
                  width: "400px",
                },
              ],
            };
          }),
      ],
    });
  }

  columns.push({
    title: journal.maximumPoints
      ? `Суммарный балл (макс. ${journal.maximumPoints})`
      : "Суммарный балл",
    align: "center",
    dataIndex: "sumPoints",
    sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
    width: "150px",
  });

  columns.push({
    title: journal.control.name,
    align: "center",
    sorter: (a: any, b: any) => (a.control > b.control ? 1 : -1),
    width: "150px",
  });

  const loading =
    isJournalFullInfoLoading ||
    isDeleteLessonLoading ||
    isDeleteAttestationLoading ||
    isStartLessonLoading;
  const lecturesCount = Math.ceil(journal.lectureHours / 2) || 0;
  const practicesCount = Math.ceil(journal.practiceHours / 2) || 0;
  const laboratoriesCount = Math.ceil(journal.laboratoryHours / 2) || 0;

  return (
    <>
      <Row align="middle" gutter={[24, 0]} style={{ marginBottom: 12 }}>
        <Col>
          <h2>
            <strong>Дисциплина: </strong>
            {isJournalFullInfoLoading ? (
              <Spin size="small" />
            ) : (
              journal.discipline.name
            )}
          </h2>
          <h2>
            <strong>Группа: </strong>
            {isJournalFullInfoLoading ? (
              <Spin size="small" />
            ) : (
              journal.group.name
            )}
          </h2>
          <h2>
            <strong>Семестр: </strong>
            {isJournalFullInfoLoading ? (
              <Spin size="small" />
            ) : (
              journal.semester
            )}
          </h2>
        </Col>

        <Col span={8}>
          <Space direction="vertical">
            <Button onClick={handleAddLesson} loading={loading}>
              Добавить занятие
            </Button>
            <Button
              onClick={() => setIsAddLessonsModalVisible(true)}
              loading={loading}
            >
              Сформировать сетку занятий
            </Button>
            {(journal.practiceHours > 0 || journal.laboratoryHours > 0) && (
              <Button
                onClick={() => setIsEditSubgroupsModalVisible(true)}
                loading={loading}
              >
                Редактирование подгрупп
              </Button>
            )}
          </Space>
        </Col>
        <Col span={8}>
          <Space direction="vertical">
            <Button onClick={handleAddAttestation} loading={loading}>
              Добавить аттестацию
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        bordered
        sticky
        dataSource={dataSource}
        // components={{
        //   header: {
        //     cell: EditableJournalHeaderCell,
        //     row: EditableRow,
        //   },
        // }}
        columns={columns}
        scroll={{ x: "max-context", y: window.screen.availHeight - 600 }}
        pagination={false}
        size="small"
        loading={loading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              console.log(record);
            }, // click row
            onDoubleClick: (event) => {}, // double click row
            onContextMenu: (event) => {}, // right button click row
            onMouseEnter: (event) => {}, // mouse enter row
            onMouseLeave: (event) => {}, // mouse leave row
          };
        }}
      />

      <AddLessonModal
        form={lessonForm}
        updateMode={isLessonEditing}
        visible={isAddOneLessonModalVisible}
        journalId={journal.id}
        lessons={journal.lessons}
        lessonTypes={journal.lessonTypes}
        lessonTopics={journal.lessonTopics}
        subgroups={journal.subgroups}
        setIsModalVisible={setIsAddLessonModalVisible}
      />

      <Modal
        title="Сформировать сетку занятий"
        centered
        visible={isAddLessonsModalVisible}
        maskClosable={false}
        footer={null}
        onOk={() => setIsAddLessonsModalVisible(false)}
        onCancel={() => setIsAddLessonsModalVisible(false)}
      >
        <AddManyLessonsForm
          journalId={journal.id}
          lessons={journal.lessons}
          setIsModalVisible={setIsAddLessonsModalVisible}
          maxLecturesCount={lecturesCount}
          maxPracticesCount={practicesCount}
          maxLaboratoriesCount={laboratoriesCount}
          lessonTypes={journal.lessonTypes}
          subgroups={journal.subgroups}
        />
      </Modal>

      <Modal
        centered
        title="Редактирование подгрупп"
        onOk={() => setIsEditSubgroupsModalVisible(false)}
        onCancel={() => setIsEditSubgroupsModalVisible(false)}
        maskClosable={false}
        visible={isEditSubgroupsModalVisible}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Закрыть"
      >
        <EditSubgroups
          groupId={journal.group.id}
          journalId={journal.id}
          students={journal.students}
          subgroups={journal.subgroups}
        />
      </Modal>

      <AddAttestationModal
        journalId={journal.id}
        form={attestationEditForm}
        visible={isAddAttestationModalVisible}
        updateMode={isAttestationEditing}
        setIsModalVisible={setIsAddAttestationModalVisible}
      />
    </>
  );
};

export default Journal;

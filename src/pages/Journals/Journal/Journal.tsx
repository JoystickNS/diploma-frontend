import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AddItemButton from "../../../components/simple/AddItemButton/AddItemButton";
import DeleteButton from "../../../components/simple/DeleteButton/DeleteButton";
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
import EditButton from "../../../components/simple/EditButton/EditButton";
import { useForm } from "antd/lib/form/Form";
import { useDeleteAttestationMutation } from "../../../services/attestations/attestations.service";
import EditSubgroups from "../../../components/smart/EditSubgroups/EditSubgroups";
import { useDispatch } from "react-redux";
import {
  deleteAnnotationAction,
  deleteAttestationAction,
  deleteLessonAction,
  setJournalAction,
  startLessonAction,
  updateManySubgroupsStudentsAction,
  updateVisitAction,
} from "../../../store/slices/journal/journal.slice";
import { useAppSelector } from "../../../hooks/redux";
import { LECTURE, PRACTICE } from "../../../constants/lessons";
import AddManyLessonsForm from "../../../components/smart/AddManyLessonsForm/AddManyLessonsForm";
import AddLessonModal from "../../../components/smart/AddLessonModal/AddLessonModal";
import AddAttestationModal from "../../../components/smart/AddAttestationModal/AddAttestationModal";
import { useCreateSubgroupStudentMutation } from "../../../services/subgroups/subgroups.service";
import { IStudentSubgroup } from "../../../models/IStudentSubgroup";
import _ from "lodash";
import StartButton from "../../../components/simple/StartButton/StartButton";
import { useUpdateVisitMutation } from "../../../services/visits/visits.service";
import OkButton from "../../../components/simple/OkButton/OkButton";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import AddAnnotationModal from "../../../components/smart/AddAnnotationModal/AddAnnotationModal";
import { useDeleteAnnotationMutation } from "../../../services/annotations/annotations.service";

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
  const [updateVisitAPI, { isLoading: isUpdateVisitLoading }] =
    useUpdateVisitMutation();
  const [deleteLessonAPI, { isLoading: isDeleteLessonLoading }] =
    useDeleteLessonMutation();
  const [deleteAttestationAPI, { isLoading: isDeleteAttestationLoading }] =
    useDeleteAttestationMutation();
  const [deleteAnnotationAPI, { isLoading: isDeleteAnnotationLoading }] =
    useDeleteAnnotationMutation();

  const [isAddAnnotationModalVisible, setIsAddAnnotationModalVisible] =
    useState<boolean>(false);
  const [isAddOneLessonModalVisible, setIsAddLessonModalVisible] =
    useState<boolean>(false);
  const [isAddLessonsModalVisible, setIsAddLessonsModalVisible] =
    useState<boolean>(false);
  const [isAddAttestationModalVisible, setIsAddAttestationModalVisible] =
    useState<boolean>(false);
  const [isEditSubgroupsModalVisible, setIsEditSubgroupsModalVisible] =
    useState<boolean>(false);

  const [isAnnotationEditing, setIsAnnotationEditing] =
    useState<boolean>(false);
  const [isAttestationEditing, setIsAttestationEditing] =
    useState<boolean>(false);
  const [isLessonEditing, setIsLessonEditing] = useState<boolean>(false);
  const [isJournalLoaded, setIsJournalLoaded] = useState<boolean>(false);
  const [isShowTodayLessons, setIsShowTodayLessons] = useState<boolean>(false);

  const [endEditingDataIndex, setEndEditingDataIndex] = useState<string>("");

  const [isSomeStudentWithoutSubgroup, setIsSomeStudentWithoutSubgroup] =
    useState<boolean>(false);

  // const [visitsInProgress, setVisitsInProgress] = useState<
  //   {
  //     lessonId: number;
  //     studentId: number;
  //   }[]
  // >([]);

  console.log("JOURNAL RENDER");

  useEffect(() => {
    if (endEditingDataIndex) {
      setEndEditingDataIndex("");
    }
  }, [endEditingDataIndex]);

  const [editingDataIndex, setEditingDataIndex] = useState<string>("");

  const [annotationForm] = useForm();
  const [attestationEditForm] = useForm();
  const [lessonForm] = useForm();

  const loading =
    isCreateSubgroupStudentLoading ||
    isJournalFullInfoLoading ||
    isDeleteLessonLoading ||
    isDeleteAttestationLoading ||
    isStartLessonLoading ||
    // isUpdateVisitLoading ||
    isDeleteAnnotationLoading;

  const isEditing = (dataIndex: string) => dataIndex === editingDataIndex;

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    isEditing: boolean;
    dataIndex: string;
    record: IJournalTable;
    lessonId?: number;
    annotationId?: number;
    lessonConducted?: boolean;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    isEditing,
    dataIndex,
    record,
    lessonId,
    annotationId,
    lessonConducted,
    children,
    ...restProps
  }) => {
    console.log("CELL RENDER");
    let childNode = children;

    if (lessonId) {
      const visit = journal.visits.find(
        (visit) => visit.lessonId === lessonId && visit.studentId === record.key
      );

      if (isEditing) {
        childNode = visit && (
          <Checkbox
            checked={record[`${lessonId} isAbsent`]?.isAbsent}
            disabled={journal.visitsInProgress.some(
              (visitInProgress) =>
                visit.lessonId === visitInProgress.lessonId &&
                visit.studentId === visitInProgress.studentId
            )}
            onChange={(e: CheckboxChangeEvent) =>
              handleAbsentChange(e.target.checked, lessonId, record.key)
            }
          />
        );
      } else {
        if (visit) {
          childNode = record[`${lessonId} isAbsent`]?.isAbsent && "H";
        }
      }
    }

    if (annotationId) {
      const point = journal.points.find(
        (point) =>
          point.annotationId === annotationId && point.studentId === record.key
      );

      const annotation = journal.annotations.find(
        (annotation) => annotation.id === annotationId
      );

      if (isEditing) {
        childNode = annotation && (
          <Form.Item name="points" style={{ margin: 0 }}>
            <Input />
          </Form.Item>
        );
      } else {
        if (annotation) {
          if (point) {
            childNode = record[`${annotationId} points`].numberOfPoints;
          } else if (lessonConducted) {
            childNode = <AddItemButton />;
          }
        }
      }
    }

    return <td {...restProps}>{childNode}</td>;
  };

  useEffect(() => {
    if (isJournalFullInfoSuccess) {
      dispatch(setJournalAction(JournalFullInfo));
      setIsJournalLoaded(true);
    }
  }, [isJournalFullInfoLoading]);

  useEffect(() => {
    (async () => {
      const result: IStudentSubgroup[] = [];
      const studentsWithoutSubgroup = journal.students.filter(
        (student) => !student.subgroup
      );

      if (studentsWithoutSubgroup.length === 0) {
        if (isSomeStudentWithoutSubgroup) {
          setIsSomeStudentWithoutSubgroup(false);
        }

        return;
      }

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

        if (isSomeStudentWithoutSubgroup) {
          setIsSomeStudentWithoutSubgroup(false);
        }
      } else if (!isSomeStudentWithoutSubgroup) {
        setIsSomeStudentWithoutSubgroup(true);
      }
    })();
  }, [journal.students, journal.subgroups]);

  useEffect(() => {}, [journal]);

  const showTodayJournal = useMemo(() => {
    return isShowTodayLessons
      ? journal.lessons.filter((lesson) =>
          moment(lesson.date).isSame(moment(), "d")
        )
      : {};
  }, [isShowTodayLessons]);

  const handleAddLesson = () => {
    lessonForm.setFieldsValue({
      subgroupIds: undefined,
      lessonTypeId: undefined,
      lessonTopic: undefined,
      date: moment(),
    });

    if (isLessonEditing) {
      setIsLessonEditing(false);
    }

    setIsAddLessonModalVisible(true);
  };

  const handleAddAttestation = () => {
    attestationEditForm.setFieldsValue({
      workTypeId: undefined,
      workTopic: undefined,
      maximumPoints: undefined,
    });

    if (isAttestationEditing) {
      setIsAttestationEditing(false);
    }

    setIsAddAttestationModalVisible(true);
  };

  const handleAddPoints = () => {};

  const handleEditPoints = () => {};

  const handleDeletePoints = () => {};

  const handleAbsentChange = async (
    value: boolean,
    lessonId: number,
    studentId: number
  ) => {
    // setVisitsInProgress([
    //   ..._.cloneDeep(visitsInProgress),
    //   { lessonId, studentId },
    // ]);
    // dispatch(addVisitInProgressAction({ lessonId, studentId }));

    updateVisitAPI({
      isAbsent: value,
      journalId: journal.id,
      lessonId,
      studentId,
    })
      .unwrap()
      .then((payload) => {
        // dispatch(deleteVisitInProgressAction({ lessonId, studentId }));
        dispatch(updateVisitAction(payload));
      })
      .catch(() => message.error("Произошла ошибка при изменении посещения"));
    // .finally(() => {
    //   setVisitsInProgress(
    //     _.cloneDeep(visitsInProgress).filter((visit) => {
    //       console.log(visit);
    //       return visit.lessonId !== lessonId && visit.studentId !== studentId;
    //     })
    //   );
    // });
  };

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
          // const studentPoint = journal.points.find(
          //   (point) =>
          //     point.studentId === student.id && point.lessonId === lesson.id
          // );
          if (studentVisit) {
            studentVisits.push({
              ...studentVisit,
              lessonId: lesson.id,
            });
          }
          // if (studentPoint) {
          //   studentPoints.push({
          //     ...studentPoint,
          //     lessonId: lesson.id,
          //   });
          // }
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

  const columns: any[] = [];

  columns.push({
    title: "ФИО студента",
    dataIndex: "studentName",
    fixed: "left",
    align: "center",
    width: "250px",
    sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
    render: (text: string, record: IJournalTable) => {
      const isSubgroup = record.subgroup || journal.subgroups.length === 1;
      return (
        <div style={{ textAlign: "left", color: isSubgroup ? "black" : "red" }}>
          {isSubgroup ? (
            text
          ) : (
            <Tooltip title="Не назначена подгруппа" color="black">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setIsEditSubgroupsModalVisible(true)}
              >
                {text}
              </div>
            </Tooltip>
          )}
        </div>
      );
    },
    shouldCellUpdate: (prevRecord: IJournalTable, record: IJournalTable) =>
      prevRecord.studentName !== record.studentName,
  });

  const lessonChildren = useMemo(() => {
    return journal.lessons.map((lesson) => {
      const handleAddAnnotation = () => {
        annotationForm.setFieldsValue({
          lessonId: lesson.id,
          name: undefined,
        });

        if (isAnnotationEditing) {
          setIsAnnotationEditing(false);
        }

        setIsAddAnnotationModalVisible(true);
      };

      const handleStartLesson = () => {
        if (isSomeStudentWithoutSubgroup) {
          message.error(
            "В группе есть студент, которому не назначена подгруппа!"
          );
          return;
        }

        startLessonAPI({
          journalId: journal.id,
          lessonId: lesson.id,
          subgroupIds: lesson.subgroups.map((subgroup) => subgroup.id),
        })
          .unwrap()
          .then((payload) => {
            dispatch(startLessonAction(payload));
            setEditingDataIndex(`${lesson.id} isAbsent`);
          })
          .catch(() =>
            message.error("Произошла ошибка при попытке начать занятие")
          );
      };

      const handleEditLesson = () => {
        lessonForm.setFieldsValue({
          lessonId: lesson.id,
          subgroupIds:
            lesson.subgroups.length === 1 ? lesson.subgroups[0].id : 0,
          lessonTypeId: lesson.lessonType.id,
          lessonTopic: lesson.lessonTopic?.name,
          date: moment(lesson.date),
        });

        if (!isLessonEditing) {
          setIsLessonEditing(true);
        }

        setIsAddLessonModalVisible(true);
      };

      const handleDeleteLesson = () => {
        deleteLessonAPI({
          lessonId: lesson.id,
          journalId: journal.id,
          subgroupId: lesson.subgroups[0].id,
        })
          .unwrap()
          .then((payload) => dispatch(deleteLessonAction(payload)))
          .catch(() => message.error("Произошла ошибка при удалении занятия"));
      };

      const annotations = journal.annotations.filter(
        (annotation) => annotation.lessonId === lesson.id
      );

      return {
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
                color: date.isSame(today, "date") ? "green" : undefined,
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
                  disabled={!!editingDataIndex}
                  tooltipText="Редактировать занятие"
                  onClick={handleEditLesson}
                />
                <DeleteButton
                  disabled={!!editingDataIndex}
                  onConfirm={handleDeleteLesson}
                />
                {!lesson.conducted ? (
                  <StartButton
                    disabled={!!editingDataIndex}
                    buttonSize={18}
                    tooltipText="Начать занятие"
                    onClick={handleStartLesson}
                  />
                ) : undefined}
              </Space>
              <AddItemButton
                disabled={!!editingDataIndex}
                tooltipText="Добавить колонку на эту дату"
                onClick={handleAddAnnotation}
              />
            </Row>
          );
        },
        children: [
          {
            title: () => (
              <Popover
                content={lesson.lessonTopic?.name || "Тема занятия отсутствует"}
              >
                <div style={{ overflow: "hidden", height: "24px" }}>
                  {lesson.lessonTopic?.name || "Тема занятия отсутствует"}
                </div>
              </Popover>
            ),
            align: "center",
            dataIndex: "lessonTopic",
            children: [
              {
                title: () => {
                  const dataIndex = `${lesson.id} isAbsent`;

                  const handleEditVisit = () => {
                    setEditingDataIndex(dataIndex);
                  };

                  const handleOkVisit = () => {
                    setEditingDataIndex("");
                    setEndEditingDataIndex(dataIndex);
                  };

                  const isSomeColumnEditing =
                    !!editingDataIndex && editingDataIndex !== dataIndex;
                  return (
                    <Space>
                      <div>Посещения</div>
                      {lesson.conducted &&
                        (editingDataIndex !== dataIndex ? (
                          <EditButton
                            disabled={isSomeColumnEditing}
                            tooltipText="Редактировать посещения"
                            onClick={handleEditVisit}
                          />
                        ) : (
                          <OkButton
                            tooltipText="Подтвердить"
                            buttonSize={20}
                            onClick={handleOkVisit}
                          />
                        ))}
                    </Space>
                  );
                },
                dataIndex: `${lesson.id} isAbsent`,
                align: "center",
                width: annotations.length === 0 ? "300px" : "150px",
                shouldCellUpdate: (
                  prevRecord: IJournalTable,
                  record: IJournalTable
                ) => {
                  const dataIndex = `${lesson.id} isAbsent`;

                  return (
                    prevRecord[dataIndex]?.isAbsent !==
                      record[dataIndex]?.isAbsent ||
                    isEditing(dataIndex) ||
                    endEditingDataIndex === dataIndex
                  );
                },
                onCell: (record: IJournalTable): any => ({
                  isEditing: isEditing(`${lesson.id} isAbsent`),
                  dataIndex: `${lesson.id} isAbsent`,
                  lessonId: lesson.id,
                  record,
                }),
              },
              ...annotations.map((annotation) => ({
                title: () => {
                  const handleEditAnnotation = () => {
                    annotationForm.setFieldsValue({
                      annotationId: annotation.id,
                      lessonId: annotation.lessonId,
                      name: annotation.name,
                    });

                    if (!isAnnotationEditing) {
                      setIsAnnotationEditing(true);
                    }

                    setIsAddAnnotationModalVisible(true);
                  };

                  const handleDeleteAnnotation = () => {
                    deleteAnnotationAPI({
                      annotationId: annotation.id,
                      journalId: journal.id,
                      lessonId: annotation.lessonId,
                    })
                      .unwrap()
                      .then((payload) =>
                        dispatch(deleteAnnotationAction(payload))
                      )
                      .catch(() =>
                        message.error("Произошла ошибка при удалении пояснения")
                      );
                  };

                  const handleEditPoints = () => {
                    setEditingDataIndex(`${annotation.id} points`);
                  };

                  const handleOkPoints = () => {
                    setEditingDataIndex("");
                  };

                  return (
                    <Space>
                      <Popover
                        content={
                          <Space>
                            {annotation.name || "Пояснение отсутствует"}
                            <EditButton
                              disabled={!!editingDataIndex}
                              tooltipText="Редактировать пояснение"
                              onClick={handleEditAnnotation}
                            />
                          </Space>
                        }
                      >
                        <div
                          style={{
                            overflow: "hidden",
                            height: "24px",
                            textAlign: "left",
                            width: "100px",
                            wordBreak: "break-all",
                          }}
                        >
                          {annotation.name || "Пояснение отсутствует"}
                        </div>
                      </Popover>
                      {editingDataIndex !== `${annotation.id} points` ? (
                        <>
                          {lesson.conducted && (
                            <EditButton
                              tooltipText="Редактировать баллы"
                              onClick={handleEditPoints}
                            />
                          )}

                          <DeleteButton
                            disabled={!!editingDataIndex}
                            onConfirm={handleDeleteAnnotation}
                          />
                        </>
                      ) : (
                        <OkButton
                          tooltipText="Подтвердить"
                          buttonSize={20}
                          onClick={handleOkPoints}
                        />
                      )}
                    </Space>
                  );
                },
                dataIndex: `${annotation.id} points`,
                align: "center",
                width: "200px",
                onCell: (record: IJournalTable) => ({
                  isEditing: isEditing(`${annotation.id} points`),
                  dataIndex: `${annotation.id} points`,
                  annotationId: annotation.id,
                  lessonConducted: lesson.conducted,
                  record,
                }),
              })),
            ],
          },
        ],
      };
    });
  }, [isJournalLoaded, editingDataIndex]);

  if (journal.lessons.length > 0) {
    columns.push({
      title: "Занятия",
      align: "center",
      children: lessonChildren,
    });
  }

  const attestations = journal.attestations.filter(
    (attestation) => attestation.workType
  );

  const attestationsChildren = useMemo(() => {
    return attestations.map((attestation) => {
      return {
        title: () => {
          const handleEditAttestation = () => {
            attestationEditForm.setFieldsValue({
              attestationId: attestation.id,
              workTypeId: attestation.workType?.id,
              workTopic: attestation.workTopic,
              maximumPoints: attestation.maximumPoints,
            });

            if (!isAttestationEditing) {
              setIsAttestationEditing(true);
            }

            setIsAddAttestationModalVisible(true);
          };

          const handleDeleteAttestation = () => {
            deleteAttestationAPI({
              journalId: journal.id,
              attestationId: attestation.id,
            })
              .unwrap()
              .then((payload) => dispatch(deleteAttestationAction(payload)))
              .catch(() =>
                message.error("Произошла ошибка при удалении аттестации")
              );
          };

          const title = attestation.maximumPoints
            ? `${attestation.workType?.name} (макс. ${attestation.maximumPoints})`
            : attestation.workType?.name;

          return (
            <Space>
              {title}
              <EditButton
                tooltipText="Редактировать промежуточную аттестацию"
                onClick={handleEditAttestation}
              />
              <DeleteButton onConfirm={handleDeleteAttestation} />
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
    });
  }, [isJournalLoaded]);

  if (attestations.length > 0) {
    columns.push({
      title: "Промежуточные аттестации",
      align: "center",
      children: attestationsChildren,
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
            <Button onClick={handleAddLesson} disabled={loading}>
              Добавить занятие
            </Button>
            <Button
              onClick={() => setIsAddLessonsModalVisible(true)}
              disabled={loading}
            >
              Сформировать сетку занятий
            </Button>
            {(journal.practiceHours > 0 || journal.laboratoryHours > 0) && (
              <Button
                onClick={() => setIsEditSubgroupsModalVisible(true)}
                disabled={loading}
              >
                Редактирование подгрупп
              </Button>
            )}
          </Space>
        </Col>
        <Col span={8}>
          <Space direction="vertical">
            <Button onClick={handleAddAttestation} disabled={loading}>
              Добавить аттестацию
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        bordered
        sticky
        dataSource={dataSource}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
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

      <AddAnnotationModal
        form={annotationForm}
        journalId={journal.id}
        updateMode={isAnnotationEditing}
        visible={isAddAnnotationModalVisible}
        setIsModalVisible={setIsAddAnnotationModalVisible}
      />

      <AddAttestationModal
        journalId={1}
        form={attestationEditForm}
        updateMode={isAttestationEditing}
        visible={isAddAttestationModalVisible}
        setIsModalVisible={setIsAddAttestationModalVisible}
      />
    </>
  );
};

export default Journal;

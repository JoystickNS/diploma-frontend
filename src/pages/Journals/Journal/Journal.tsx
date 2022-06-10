import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  Table,
} from "antd";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetJournalFullInfoQuery } from "../../../services/journals/journals.service";
import { IJournalTable } from "./Journal.interface";
import { useForm } from "antd/lib/form/Form";
import EditSubgroups from "../../../components/smart/EditSubgroups/EditSubgroups";
import { useDispatch } from "react-redux";
import {
  setJournalAction,
  updateManySubgroupsStudentsAction,
} from "../../../store/slices/journal/journal.slice";
import { useAppSelector } from "../../../hooks/redux";
import AddManyLessonsForm from "../../../components/smart/AddManyLessonsForm/AddManyLessonsForm";
import AddLessonModal from "../../../components/smart/AddLessonModal/AddLessonModal";
import AddAttestationModal from "../../../components/smart/AddAttestationModal/AddAttestationModal";
import { useCreateSubgroupStudentMutation } from "../../../services/subgroups/subgroups.service";
import { IStudentSubgroup } from "../../../models/IStudentSubgroup";
import _ from "lodash";
import AddAnnotationModal from "../../../components/smart/AddAnnotationModal/AddAnnotationModal";
import { IVisit } from "../../../models/IVisit";
import { IPoint } from "../../../models/IPoint";
import JournalTableStudentName from "../../../components/smart/JournalTable/JournalTableStudentName/JournalTableStudentName";
import JournalTableLesson from "../../../components/smart/JournalTable/JournalTableLesson/JournalTableLesson";
import JournalTableLessonTopic from "../../../components/smart/JournalTable/JournalTableLessonTopic/JournalTableLessonTopic";
import JournalTableStudentAbsent from "../../../components/smart/JournalTable/JournalTableStudentAbsent/JournalTableStudentAbsent";
import JournalTableAnnotation from "../../../components/smart/JournalTable/JournalTableAnnotation/JournalTableAnnotation";
import JournalTableAttestation from "../../../components/smart/JournalTable/JournalTableAttestation/JournalTableAttestation";
import JournalEditableCell from "../../../components/smart/JournalTable/JournalEditableCell/JournalEditableCell";
import JournalEditableRow from "../../../components/smart/JournalTable/JournalEditableRow/JournalEditableRow";
import PopCodeConfirm from "../../../components/smart/PopCodeConfirm/PopCodeConfirm";
import { ExportOutlined } from "@ant-design/icons";
import { COURSE_PROJECT, COURSE_WORK } from "../../../constants/workTypes";
import JournalTableAttestationEdit from "../../../components/smart/JournalTable/JournalTableAttestationEdit/JournalTableAttestationEdit";
import { LECTURE, PRACTICE } from "../../../constants/lessons";
import * as XLSX from "xlsx";

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

  const [isStartLessonLoading, setIsStartLessonLoading] =
    useState<boolean>(false);

  const [isDeleteLessonLoading, setIsDeleteLessonLoading] =
    useState<boolean>(false);

  const [isDeleteAnnotationLoading, setIsDeleteAnnotationLoading] =
    useState<boolean>(false);

  const [isDeleteAttestationLoading, setIsDeleteAttestationLoading] =
    useState<boolean>(false);

  const [isSomeStudentWithoutSubgroup, setIsSomeStudentWithoutSubgroup] =
    useState<boolean>(false);

  // console.log("JOURNAL RENDER");

  useEffect(() => {
    if (endEditingDataIndex) {
      setEndEditingDataIndex("");
    }
  }, [endEditingDataIndex]);

  const [editingDataIndex, setEditingDataIndex] = useState<string>("");

  const [annotationForm] = useForm();
  const [attestationForm] = useForm();
  const [lessonForm] = useForm();

  const loading =
    isCreateSubgroupStudentLoading ||
    isJournalFullInfoLoading ||
    isDeleteLessonLoading ||
    isDeleteAttestationLoading ||
    isStartLessonLoading ||
    isDeleteAnnotationLoading;

  const shownLessons = useMemo(() => {
    if (isShowTodayLessons) {
      return journal.lessons.filter((lesson) =>
        moment(lesson.date).isSame(moment(), "d")
      );
    }

    return journal.lessons;
  }, [journal.lessons, isShowTodayLessons]);

  const isEditing = (dataIndex: string) => dataIndex === editingDataIndex;

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
    attestationForm.setFieldsValue({
      workTypeId: undefined,
      workTopic: undefined,
      maximumPoints: undefined,
    });

    if (isAttestationEditing) {
      setIsAttestationEditing(false);
    }

    setIsAddAttestationModalVisible(true);
  };

  const handleExportToExcel = () => {
    const json: any[] = [];

    journal.students.forEach((student, i) => {
      const temp: any = {};

      temp["№"] = i + 1;
      temp[
        "ФИО студента"
      ] = `${student.lastName} ${student.firstName} ${student.middleName}`;

      let pointsCount = 0;
      let absenteeismCount = 0;

      journal.lessons.forEach((lesson) => {
        const lessonDate = `${moment(lesson.date).format("DD.MM")}`;
        const lessonType =
          lesson.lessonType.name === LECTURE
            ? "Лек."
            : lesson.lessonType.name === PRACTICE
            ? "Пр."
            : "Лаб.";

        const visit = journal.visits.find(
          (visit) =>
            visit.studentId === student.id && visit.lessonId === lesson.id
        );

        if (visit?.isAbsent) {
          absenteeismCount++;
        }

        temp[`${lessonDate} ${lessonType}`] = visit?.isAbsent ? "н" : undefined;
      });

      const annotations = journal.annotations.filter((annotation) =>
        journal.points.some(
          (point) =>
            point.annotationId === annotation.id &&
            point.studentId === student.id
        )
      );

      annotations.forEach((annotation) =>
        journal.points.forEach((point) => {
          if (
            annotation.id === point.annotationId &&
            student.id === point.studentId
          ) {
            pointsCount += point.numberOfPoints;
          }
        })
      );

      journal.attestations.forEach((attestation) => {
        const attestationOnStudent = journal.attestationsOnStudents.find(
          (attestationOnStudent) =>
            attestation.id === attestationOnStudent.attestationId &&
            student.id === attestationOnStudent.studentId
        );

        if (attestationOnStudent && attestationOnStudent.points) {
          pointsCount += attestationOnStudent.points;
        }
      });

      temp["Пропуски (часов)"] = absenteeismCount * 2;
      temp["Сумма баллов"] = pointsCount;

      json.push(temp);
    });

    const header = Object.keys(json[0]);
    const wsCols = [];
    for (let i = 0; i < header.length; i++) {
      if (header[i] === "ФИО студента") {
        wsCols.push({
          wch: Math.max(...json.map((item) => item["ФИО студента"].length + 3)),
        });
      } else {
        wsCols.push({ wch: header[i].length + 3 });
      }
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(json);
    worksheet["!cols"] = wsCols;
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFileXLSX(
      workbook,
      `${journal.group.name}_${journal.discipline.name}_${journal.semester}семестр.xlsx`
    );
  };

  const studentsInfo: any[] = useMemo(() => {
    console.log("journal.students");
    return journal.students.map((student, i) => ({
      studentNumber: i + 1,
      key: student.id,
      studentName: `${student.lastName} ${student.firstName} ${student.middleName}`,
      subgroup: student.subgroup,
    }));
  }, [journal.students]);

  const studentsVisits: { [x: string]: IVisit }[][] = useMemo(() => {
    const allVisits: any[] = [];
    console.log("journal.visits");
    journal.students.forEach((student) => {
      const temp = {} as any;
      journal.visits
        .filter((visit) => visit.studentId === student.id)
        .forEach((visit) => (temp[`${visit.lessonId} isAbsent`] = visit));
      allVisits.push(temp);
    });

    return allVisits;
  }, [journal.visits]);

  const sumPoints: { sumPoints: number }[] = [];

  const studentsPoints: { [x: string]: IPoint }[][] = useMemo(() => {
    const allPoints: any[] = [];
    console.log("journal.annotations, journal.points");
    journal.students.forEach((student) => {
      const temp = {} as any;
      let sum = 0;
      journal.points
        .filter((point) => point.studentId === student.id)
        .forEach((point) => {
          temp[`${point.annotationId} points`] = point;
          sum += point.numberOfPoints;
        });
      allPoints.push(temp);
      journal.attestations.forEach((attestation) => {
        const attestationOnStudent = journal.attestationsOnStudents.find(
          (attestationOnStudent) =>
            attestation.id === attestationOnStudent.attestationId &&
            student.id === attestationOnStudent.studentId
        );

        if (attestationOnStudent && attestationOnStudent.points) {
          sum += attestationOnStudent.points;
        }
      });
      sumPoints.push({ sumPoints: sum });
    });

    return allPoints;
  }, [journal.annotations, journal.points, journal.attestationsOnStudents]);

  const dataSource = useMemo(
    () =>
      studentsInfo.map((studentInfo, i) => ({
        ...studentInfo,
        ...studentsVisits[i],
        ...studentsPoints[i],
        ...sumPoints[i],
      })),
    [journal]
  );

  const columns: any[] = [];

  columns.push({
    title: "№",
    dataIndex: "studentNumber",
    fixed: "left",
    align: "center",
    width: "50px",
  });

  columns.push({
    title: "ФИО студента",
    dataIndex: "studentName",
    fixed: "left",
    align: "center",
    width: "300px",
    sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
    render: (text: string, record: IJournalTable) => {
      const isSubgroup = record.subgroup || journal.subgroups.length === 1;
      return (
        <JournalTableStudentName
          subgroupsCount={journal.subgroups.length}
          studentName={text}
          isSubgroup={isSubgroup}
          setIsModalVisible={setIsEditSubgroupsModalVisible}
        />
      );
    },
  });

  const lessonChildren = useMemo(() => {
    console.log("isJournalLoaded, editingDataIndex");
    return shownLessons.map((lesson) => {
      const annotations = journal.annotations.filter(
        (annotation) => annotation.lessonId === lesson.id
      );
      return {
        title: (
          <JournalTableLesson
            journalId={journal.id}
            lesson={lesson}
            subgroupsCount={journal.subgroups.length}
            editingDataIndex={editingDataIndex}
            annotationForm={annotationForm}
            lessonForm={lessonForm}
            isAnnotationEditing={isAnnotationEditing}
            isSomeStudentWithoutSubgroup={isSomeStudentWithoutSubgroup}
            isLessonEditing={isLessonEditing}
            setEditingDataIndex={setEditingDataIndex}
            setIsAddAnnotationModalVisible={setIsAddAnnotationModalVisible}
            setIsAddLessonModalVisible={setIsAddLessonModalVisible}
            setIsAnnotationEditing={setIsAnnotationEditing}
            setIsLessonEditing={setIsLessonEditing}
            setIsStartLessonLoading={setIsStartLessonLoading}
            setIsDeleteLessonLoading={setIsDeleteLessonLoading}
          />
        ),
        children: [
          {
            title: (
              <JournalTableLessonTopic lessonTopic={lesson.lessonTopic?.name} />
            ),
            align: "center",
            dataIndex: "lessonTopic",
            children: [
              {
                title: (
                  <JournalTableStudentAbsent
                    lessonId={lesson.id}
                    lessonConducted={lesson.conducted}
                    editingDataIndex={editingDataIndex}
                    setEditingDataIndex={setEditingDataIndex}
                    setEndEditingDataIndex={setEndEditingDataIndex}
                  />
                ),
                dataIndex: `${lesson.id} isAbsent`,
                align: "center",
                width: annotations.length === 0 ? "350px" : "150px",
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
                onCell: (record: IJournalTable): any => {
                  const dataIndex = `${lesson.id} isAbsent`;
                  return {
                    isEditing: isEditing(dataIndex),
                    dataIndex,
                    lessonId: lesson.id,
                    journalId: journal.id,
                    studentId: record.key,
                    isAbsent: record[dataIndex]?.isAbsent,
                  };
                },
              },
              ...annotations.map((annotation) => ({
                title: (
                  <JournalTableAnnotation
                    annotation={annotation}
                    editingDataIndex={editingDataIndex}
                    form={annotationForm}
                    isAnnotationEditing={isAnnotationEditing}
                    journalId={journal.id}
                    lesson={lesson}
                    setEditingDataIndex={setEditingDataIndex}
                    setIsAddAnnotationModalVisible={
                      setIsAddAnnotationModalVisible
                    }
                    setIsAnnotationEditing={setIsAnnotationEditing}
                    setIsDeleteAnnotationLoading={setIsDeleteAnnotationLoading}
                  />
                ),
                dataIndex: `${annotation.id} points`,
                align: "center",
                width: "200px",
                onCell: (record: IJournalTable) => {
                  const dataIndex = `${annotation.id} points`;
                  return {
                    isEditing: isEditing(dataIndex),
                    journalId: journal.id,
                    studentId: record.key,
                    lessonId: lesson.id,
                    dataIndex,
                    annotationId: annotation.id,
                    lessonConducted: lesson.conducted,
                    pointId: journal.points.find(
                      (point) =>
                        point.studentId === record.key &&
                        point.annotationId === annotation.id
                    )?.id,
                    numberOfPoints: record[dataIndex]?.numberOfPoints,
                  };
                },
              })),
            ],
          },
        ],
      };
    });
  }, [
    journal.annotations,
    shownLessons,
    journal.visits,
    journal.points,
    isJournalLoaded,
    editingDataIndex,
  ]);

  if (shownLessons.length > 0) {
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
      const workTypeName = attestation.workType.name;
      const workTopicChildren = [
        {
          title: (
            <JournalTableAttestationEdit
              attestationId={attestation.id}
              columnName="Баллы"
              editingDataIndex={editingDataIndex}
              setEditingDataIndex={setEditingDataIndex}
              setEndEditingDataIndex={setEndEditingDataIndex}
            />
          ),
          align: "center",
          width: "200px",
          onCell: (record: IJournalTable) => {
            const attestationOnStudent = journal.attestationsOnStudents.find(
              (attestationOnStudent) =>
                attestationOnStudent.attestationId === attestation.id &&
                attestationOnStudent.studentId === record.key
            );
            return {
              isEditing: isEditing(`${attestation.id} attestation`),
              journalId: journal.id,
              studentId: record.key,
              dataIndex: `${attestation.id} attestationPoints`,
              attestationId: attestation.id,
              credited: attestationOnStudent?.credited,
              attestationGrade: attestationOnStudent?.grade,
              attestationPoints: attestationOnStudent?.points,
            };
          },
        },
      ];
      const fullWorkTopicChildren =
        workTypeName === COURSE_PROJECT || workTypeName === COURSE_WORK
          ? [
              {
                title: (
                  <JournalTableAttestationEdit
                    attestationId={attestation.id}
                    columnName="Оценка"
                    editingDataIndex={editingDataIndex}
                    setEditingDataIndex={setEditingDataIndex}
                    setEndEditingDataIndex={setEndEditingDataIndex}
                  />
                ),
                align: "center",
                width: "200px",
                onCell: (record: IJournalTable) => {
                  const attestationOnStudent =
                    journal.attestationsOnStudents.find(
                      (attestationOnStudent) =>
                        attestationOnStudent.attestationId === attestation.id &&
                        attestationOnStudent.studentId === record.key
                    );
                  return {
                    isEditing: isEditing(`${attestation.id} attestation`),
                    journalId: journal.id,
                    studentId: record.key,
                    dataIndex: `${attestation.id} attestationGrade`,
                    attestationId: attestation.id,
                    credited: attestationOnStudent?.credited,
                    attestationGrade: attestationOnStudent?.grade,
                    attestationPoints: attestationOnStudent?.points,
                  };
                },
              },
              ...workTopicChildren,
            ]
          : [
              {
                title: (
                  <JournalTableAttestationEdit
                    attestationId={attestation.id}
                    columnName="Выполнено"
                    editingDataIndex={editingDataIndex}
                    setEditingDataIndex={setEditingDataIndex}
                    setEndEditingDataIndex={setEndEditingDataIndex}
                  />
                ),
                align: "center",
                width: "200px",
                onCell: (record: IJournalTable) => {
                  const attestationOnStudent =
                    journal.attestationsOnStudents.find(
                      (attestationOnStudent) =>
                        attestationOnStudent.attestationId === attestation.id &&
                        attestationOnStudent.studentId === record.key
                    );
                  return {
                    isEditing: isEditing(`${attestation.id} attestation`),
                    journalId: journal.id,
                    studentId: record.key,
                    dataIndex: `${attestation.id} attestationCompleted`,
                    attestationId: attestation.id,
                    credited: attestationOnStudent?.credited,
                    attestationGrade: attestationOnStudent?.grade,
                    attestationPoints: attestationOnStudent?.points,
                  };
                },
              },
              ...workTopicChildren,
            ];
      return {
        title: (
          <JournalTableAttestation
            attestation={attestation}
            form={attestationForm}
            isAttestationEditing={isAttestationEditing}
            journalId={journal.id}
            editingDataIndex={editingDataIndex}
            setIsAddAttestationModalVisible={setIsAddAttestationModalVisible}
            setIsAttestationEditing={setIsAttestationEditing}
            setIsDeleteAttestationLoading={setIsDeleteAttestationLoading}
          />
        ),
        align: "center",
        children: [
          {
            title: attestation.workTopic
              ? attestation.workTopic
              : "Тема аттестации отсутствует",
            align: "center",
            children: [...fullWorkTopicChildren],
          },
        ],
      };
    });
  }, [
    isJournalLoaded,
    journal.attestations,
    journal.attestationsOnStudents,
    editingDataIndex,
  ]);

  if (attestations.length > 0) {
    columns.push({
      title: "Промежуточные аттестации",
      align: "center",
      children: attestationsChildren,
    });
  }

  if (journal.points.length > 0 || attestations.length > 0) {
    columns.push({
      title: journal.maximumPoints
        ? `Суммарный балл (макс. ${journal.maximumPoints})`
        : "Суммарный балл",
      align: "center",
      dataIndex: "sumPoints",
      sorter: (a: any, b: any) => (a.studentName > b.studentName ? 1 : -1),
      width: "150px",
    });
  }

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
      <Row align="top" gutter={[24, 0]} style={{ marginBottom: 12 }}>
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
          <Space direction="vertical">
            <PopCodeConfirm
              text="После выполнения данной операции, журнал не будет виден в списке ваших журналов."
              code={journal.id.toString()}
              onOk={() => {}}
            >
              <Button danger>Удалить журнал из видимых</Button>
            </PopCodeConfirm>

            <PopCodeConfirm
              text={
                <div style={{ color: "red" }}>
                  Вся информация связанная с данным журналом будет удалена!!!
                </div>
              }
              code={journal.id.toString()}
              onOk={() => {}}
            >
              <Button type="primary" danger>
                Удалить журнал полностью
              </Button>
            </PopCodeConfirm>

            <Button
              icon={<ExportOutlined />}
              type="primary"
              onClick={handleExportToExcel}
            >
              Получить отчёт
            </Button>
          </Space>
        </Col>

        <Col span={4}>
          {/* <Row>Параметры создания журнала</Row> */}
          <Space direction="vertical">
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
            <Button onClick={handleAddLesson} disabled={loading}>
              Добавить занятие
            </Button>
          </Space>
        </Col>
        <Col span={4}>
          <Space direction="vertical">
            <Button onClick={handleAddAttestation} disabled={loading}>
              Добавить аттестацию
            </Button>
            <Space>
              <Switch
                checked={isShowTodayLessons}
                onChange={() => setIsShowTodayLessons(!isShowTodayLessons)}
              />
              <div>Сегодняшние занятия</div>
            </Space>
          </Space>
        </Col>

        <Col span={4}></Col>
      </Row>

      <Table
        bordered
        sticky
        dataSource={dataSource}
        components={{
          body: {
            cell: JournalEditableCell,
            row: JournalEditableRow,
          },
        }}
        columns={columns}
        scroll={{ x: "max-context", y: window.screen.availHeight - 300 }}
        pagination={false}
        size="small"
        rowClassName={"table-row editable-row"}
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
        journalId={journal.id}
        form={attestationForm}
        updateMode={isAttestationEditing}
        visible={isAddAttestationModalVisible}
        setIsModalVisible={setIsAddAttestationModalVisible}
      />
    </>
  );
};

export default Journal;

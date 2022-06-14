import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteJournalMutation,
  useGetJournalFullInfoQuery,
  useUpdateJournalMutation,
} from "../../../services/journals/journals.service";
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
import { ExportOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { COURSE_PROJECT, COURSE_WORK } from "../../../constants/workTypes";
import JournalTableAttestationEdit from "../../../components/smart/JournalTable/JournalTableAttestationEdit/JournalTableAttestationEdit";
import { LECTURE, PRACTICE } from "../../../constants/lessons";
import { ILesson } from "../../../models/ILesson";
import { RouteName } from "../../../constants/routes";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  calculateExcelColumnsWidth,
  createBorderForCells,
  createOuterBorder,
  setAlignment,
} from "../../../utils/excel";

const { Option } = Select;

const LESSONS_PER_PAGE = 7;

const Journal: FC = () => {
  const { journalId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const [updateJournalAPI] = useUpdateJournalMutation();
  const [deleteJournalAPI] = useDeleteJournalMutation();

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

  const [pageNumber, setPageNumber] = useState<number>(1);

  const [selectedLessons, setSelectedLessons] = useState<ILesson[]>([]);

  const [isRerenderStudentNameCells, setIsRerenderStudentNameCells] =
    useState<boolean>(false);

  console.log("JOURNAL RENDER");

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

  const isEditing = (dataIndex: string) => dataIndex === editingDataIndex;

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

  useEffect(() => {
    handleSetLessonPage(pageNumber);
  }, [journal.lessons]);

  // useEffect(() => {
  //   if (isRerenderStudentNameCells) {
  //     setIsRerenderStudentNameCells(false);
  //   }
  // }, [isRerenderStudentNameCells]);

  useEffect(() => {
    if (!isRerenderStudentNameCells) {
      setIsRerenderStudentNameCells(true);
    }
  }, [journal.lessons.length, journal.subgroups.length]);

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

  const handleSetLessonPage = (value: number) => {
    setPageNumber(value);
    if (journal.lessons.length > 7) {
      setSelectedLessons(
        value !== pagesCount
          ? journal.lessons.slice(
              (value - 1) * LESSONS_PER_PAGE,
              value * LESSONS_PER_PAGE
            )
          : journal.lessons.slice(
              (value - 1) * LESSONS_PER_PAGE,
              journal.lessons.length
            )
      );
    } else {
      setSelectedLessons(journal.lessons);
    }
  };

  const handleSetCurrentLessons = () => {
    for (let i = 0; i < journal.lessons.length; i++) {
      if (!journal.lessons[i].conducted) {
        const pageNum = Math.ceil((i + 1) / LESSONS_PER_PAGE);
        if (pageNum !== pageNumber) {
          handleSetLessonPage(pageNum);
        }

        break;
      }
    }
  };

  const handleHideJournal = () => {
    updateJournalAPI({ journalId: journal.id, deleted: true })
      .then(() => {
        navigate(RouteName.Journals, { replace: true });
      })
      .catch(() => message.error("Произошла ошибка при удалении журнала"));
  };

  const handleDeleteJournal = () => {
    deleteJournalAPI(journal.id)
      .then(() => {
        navigate(RouteName.Journals, { replace: true });
      })
      .catch(() => message.error("Произошла ошибка при удалении журнала"));
  };

  const handleExportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Лист 1");

    // Информация о отчёте
    worksheet.getCell("A1").value = "Дисциплина";
    worksheet.getCell("B1").value = journal.discipline.name;
    worksheet.getCell("A2").value = "Группа";
    worksheet.getCell("B2").value = journal.group.name;
    worksheet.getCell("A3").value = "Семестр";
    worksheet.getCell("B3").alignment = { horizontal: "left" };
    worksheet.getCell("B3").value = journal.semester;
    worksheet.getCell("A4").value = "Преподаватель";
    worksheet.getCell("B4").value = `${
      journal.user.lastName
    } ${journal.user.firstName[0].toUpperCase()}. ${journal.user.middleName[0].toUpperCase()}.`;
    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("A2").font = { bold: true };
    worksheet.getCell("A3").font = { bold: true };
    worksheet.getCell("A4").font = { bold: true };

    createBorderForCells(worksheet, { col: 1, row: 1 }, { col: 2, row: 4 });
    createOuterBorder(worksheet, { col: 1, row: 1 }, { col: 2, row: 4 });

    worksheet.addRow(null);

    // Шапка таблицы
    const header = ["№", "ФИО студента"];
    const isSubgroups = journal.subgroups.length > 1;
    journal.lessons.forEach((lesson) => {
      const lessonDate = `${moment(lesson.date).format("DD.MM")}`;
      const lessonType =
        lesson.lessonType.name === LECTURE
          ? "лек."
          : lesson.lessonType.name === PRACTICE
          ? "пр."
          : "лаб.";
      if (isSubgroups && lesson.lessonType.name !== LECTURE) {
        header.push(
          `${lessonDate} ${lessonType} ${lesson.subgroups[0].subgroupNumber.value} пдгр.`
        );
      } else {
        header.push(`${lessonDate} ${lessonType}`);
      }
    });
    header.push("Пропуски (часов)");
    header.push("Баллов");

    worksheet.addRow(header);
    worksheet.getRow(6).font = { bold: true };

    // Основная информация таблицы
    journal.students.forEach((student, studentIndex) => {
      const rowValues = [];

      const studentName = `${student.lastName} ${student.firstName} ${student.middleName}`;

      rowValues[0] = studentIndex + 1;
      rowValues[1] = studentName;

      let absenteeismCount = 0;
      let pointsCount = 0;

      journal.lessons.forEach((lesson, lessonIndex) => {
        const visit = journal.visits.find(
          (visit) =>
            visit.studentId === student.id && visit.lessonId === lesson.id
        );
        if (visit?.isAbsent) {
          absenteeismCount++;
          rowValues[lessonIndex + 2] = "н";
        }

        worksheet.columns[lessonIndex + 2].alignment = {
          horizontal: "center",
          vertical: "middle",
        };
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

      rowValues[journal.lessons.length + 2] = absenteeismCount * 2;
      rowValues[journal.lessons.length + 3] = pointsCount;

      worksheet.addRow(rowValues);
    });

    // Выравнивание пропуском и баллов по центру
    worksheet.columns[journal.lessons.length + 2].alignment = {
      horizontal: "center",
    };
    worksheet.columns[journal.lessons.length + 3].alignment = {
      horizontal: "center",
    };

    // Выравнивание № студента
    setAlignment(worksheet, 1, 6, journal.students.length + 6, {
      horizontal: "center",
    });

    // Выравнивание ФИО студента
    worksheet.getCell("B6").alignment = { horizontal: "center" };

    calculateExcelColumnsWidth(worksheet);
    createBorderForCells(
      worksheet,
      { col: 1, row: 6 },
      { col: journal.lessons.length + 4, row: journal.students.length + 6 }
    );

    createOuterBorder(
      worksheet,
      { col: 1, row: 6 },
      { col: journal.lessons.length + 4, row: journal.students.length + 6 }
    );

    // Разворот текста дат занятий
    for (let i = 3; i < journal.lessons.length + 3; i++) {
      worksheet.getCell(6, i).alignment = {
        textRotation: 90,
      };
      worksheet.columns[i - 1].width = 3;
    }

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      saveAs(
        blob,
        `${journal.group.name}_${journal.discipline.name}_${journal.semester}семестр.xlsx`
      );
    });
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
        subgroups: journal.subgroups,
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
    responsive: ["md"],
    shouldCellUpdate: () => false,
  });

  columns.push({
    title: "ФИО студента",
    dataIndex: "studentName",
    fixed: "left",
    align: "center",
    width:
      window.screen.availWidth < 350
        ? "100px"
        : window.screen.availWidth > 350 && window.screen.availWidth < 500
        ? "200px"
        : "300px",
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
    shouldCellUpdate: (prevRecord: IJournalTable, record: IJournalTable) => {
      console.log("UPDATE STUDENT CELL");
      if (isRerenderStudentNameCells) {
        console.log(32124234);
      }
      return (
        prevRecord.subgroup.subgroupNumber.id !==
          record.subgroup.subgroupNumber.id || isRerenderStudentNameCells
      );
    },
  });

  const lessonChildren = useMemo(() => {
    console.log("isJournalLoaded, editingDataIndex");
    return selectedLessons.map((lesson) => {
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
                    a: 1,
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
    selectedLessons,
    editingDataIndex,
    journal.annotations,
    journal.visits,
    journal.points,
  ]);

  if (selectedLessons.length > 0) {
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
  }, [journal.attestations, journal.attestationsOnStudents, editingDataIndex]);

  if (attestations.length > 0) {
    columns.push({
      title: "Промежуточные аттестации",
      align: "center",
      children: attestationsChildren,
    });
  }

  if (journal.points.length > 0 || journal.attestationsOnStudents.length > 0) {
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
    width: "200px",
  });

  const lecturesCount = Math.ceil(journal.lectureHours / 2) || 0;
  const practicesCount = Math.ceil(journal.practiceHours / 2) || 0;
  const laboratoriesCount = Math.ceil(journal.laboratoryHours / 2) || 0;
  const pagesCount = useMemo(
    () => Math.ceil(journal.lessons.length / LESSONS_PER_PAGE),
    [journal.lessons.length]
  );
  return (
    <>
      <Row align="top" gutter={[24, 0]} style={{ marginBottom: 12 }}>
        <Col
          xs={{ span: 24 }}
          md={{ span: 8 }}
          lg={{ span: 6 }}
          xl={{ span: 5 }}
          xxl={{ span: 4 }}
          style={{ marginBottom: 12 }}
        >
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
              onOk={handleHideJournal}
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
              onOk={handleDeleteJournal}
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

        <Col
          xs={{ span: 24 }}
          md={{ span: 16 }}
          lg={{ span: 6 }}
          xl={{ span: 5 }}
          xxl={{ span: 4 }}
          style={{ marginBottom: 12 }}
        >
          <Space direction="vertical">
            <Button
              onClick={() => setIsAddLessonsModalVisible(true)}
              disabled={loading || !!editingDataIndex}
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

            <Button
              onClick={handleAddLesson}
              disabled={loading || !!editingDataIndex}
            >
              Добавить занятие
            </Button>

            <Button onClick={handleAddAttestation} disabled={loading}>
              Добавить аттестацию
            </Button>
          </Space>
        </Col>

        {journal.lessons.length > LESSONS_PER_PAGE && (
          <Col
            xs={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}
            xl={{ span: 7 }}
            xxl={{ span: 6 }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>Промежуток занятий</div>
              <Row justify="space-between">
                <Button
                  onClick={() => handleSetLessonPage(pageNumber - 1)}
                  icon={<LeftOutlined />}
                  disabled={pageNumber === 1 || !!editingDataIndex}
                ></Button>

                <Select
                  value={pageNumber}
                  onChange={handleSetLessonPage}
                  style={{ width: "70%" }}
                  disabled={!!editingDataIndex}
                >
                  {Array.from({ length: pagesCount }, (_, i) => i + 1).map(
                    (i) => {
                      const label =
                        i !== pagesCount
                          ? `${moment(
                              journal.lessons[(i - 1) * LESSONS_PER_PAGE].date
                            ).format("DD.MM.YYYY")} - ${moment(
                              journal.lessons[i * LESSONS_PER_PAGE - 1].date
                            ).format("DD.MM.YYYY")}`
                          : `${moment(
                              journal.lessons[(i - 1) * LESSONS_PER_PAGE].date
                            ).format("DD.MM.YYYY")} - ${moment(
                              journal.lessons[journal.lessons.length - 1].date
                            ).format("DD.MM.YYYY")}`;
                      return (
                        <Option key={i} value={i} label>
                          {label}
                        </Option>
                      );
                    }
                  )}
                </Select>

                <Button
                  onClick={() => handleSetLessonPage(pageNumber + 1)}
                  icon={<RightOutlined />}
                  disabled={pageNumber === pagesCount || !!editingDataIndex}
                ></Button>
                {/* <Switch
                checked={isShowTodayLessons}
                onChange={() => setIsShowTodayLessons(!isShowTodayLessons)}
              />
              <div>Сегодняшние занятия</div> */}
              </Row>
              <Button
                onClick={handleSetCurrentLessons}
                disabled={!!editingDataIndex}
              >
                Перейти к первому не начатому занятию
              </Button>
            </Space>
          </Col>
        )}
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

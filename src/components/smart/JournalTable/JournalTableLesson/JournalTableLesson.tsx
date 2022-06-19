import { message, Row, Space, Tag } from "antd";
import moment from "moment";
import { FC, memo, useCallback, useEffect } from "react";
import { LECTURE, PRACTICE } from "../../../../constants/lessons";
import { ActionName, SubjectName } from "../../../../constants/permissions";
import { useAppDispatch } from "../../../../hooks/redux";
import {
  useDeleteLessonMutation,
  useStartLessonMutation,
} from "../../../../services/lessons/lessons.service";
import {
  deleteLessonAction,
  startLessonAction,
} from "../../../../store/slices/journal/journal.slice";
import { s } from "../../../../utils/abilities";
import AddItemButton from "../../../simple/AddItemButton/AddItemButton";
import Can from "../../../simple/Can/Can";
import DeleteButton from "../../../simple/DeleteButton/DeleteButton";
import EditButton from "../../../simple/EditButton/EditButton";
import StartButton from "../../../simple/StartButton/StartButton";
import { JournalTableLessonProps } from "./JournalTableLesson.interface";

const JournalTableLesson: FC<JournalTableLessonProps> = ({
  journalId,
  journalOwnerId,
  lesson,
  subgroupsCount,
  annotationForm,
  lessonForm,
  editingDataIndex,
  isAnnotationEditing,
  isSomeStudentWithoutSubgroup,
  isLessonEditing,
  setIsLessonEditing,
  setIsAddAnnotationModalVisible,
  setIsAnnotationEditing,
  setEditingDataIndex,
  setIsAddLessonModalVisible,
  setIsStartLessonLoading,
  setIsDeleteLessonLoading,
}) => {
  const dispatch = useAppDispatch();

  const [startLessonAPI, { isLoading: isStartLessonLoading }] =
    useStartLessonMutation();

  const [deleteLessonAPI, { isLoading: isDeleteLessonLoading }] =
    useDeleteLessonMutation();

  useEffect(() => {
    setIsStartLessonLoading(isStartLessonLoading);
  }, [isStartLessonLoading]);

  useEffect(() => {
    setIsDeleteLessonLoading(isDeleteLessonLoading);
  }, [isDeleteLessonLoading]);

  const handleAddAnnotation = useCallback(() => {
    annotationForm.setFieldsValue({
      lessonId: lesson.id,
      name: undefined,
    });

    if (isAnnotationEditing) {
      setIsAnnotationEditing(false);
    }

    setIsAddAnnotationModalVisible(true);
  }, [lesson.id]);

  const handleStartLesson = useCallback(() => {
    if (isSomeStudentWithoutSubgroup) {
      message.error("В группе есть студент, которому не назначена подгруппа!");
      return;
    }

    startLessonAPI({
      journalId,
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
  }, [lesson.id]);

  const handleEditLesson = useCallback(() => {
    lessonForm.setFieldsValue({
      lessonId: lesson.id,
      subgroupIds: lesson.subgroups.length === 1 ? lesson.subgroups[0].id : 0,
      lessonTypeId: lesson.lessonType.id,
      lessonTopic: lesson.lessonTopic?.name,
      date: moment(lesson.date),
    });

    if (!isLessonEditing) {
      setIsLessonEditing(true);
    }

    setIsAddLessonModalVisible(true);
  }, [lesson.id, lesson.lessonType]);

  const handleDeleteLesson = useCallback(() => {
    deleteLessonAPI({
      lessonId: lesson.id,
      journalId,
      subgroupId: lesson.subgroups[0].id,
    })
      .unwrap()
      .then((payload) => dispatch(deleteLessonAction(payload)))
      .catch(() => message.error("Произошла ошибка при удалении занятия"));
  }, [lesson.id]);

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
      <Space size="small">
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
          {subgroupsCount > 1 &&
            lesson.subgroups.length === 1 &&
            ` ${lesson.subgroups[0].subgroupNumber.value} пдгр.`}
        </Tag>

        <Can
          I={ActionName.Update}
          this={s(SubjectName.Journal, { userId: journalOwnerId })}
        >
          {() => (
            <EditButton
              disabled={!!editingDataIndex}
              tooltipText="Редактировать занятие"
              onClick={handleEditLesson}
            />
          )}
        </Can>

        <Can
          I={ActionName.Delete}
          this={s(SubjectName.Journal, { userId: journalOwnerId })}
        >
          {() => (
            <DeleteButton
              tooltipText="Удалить занятие"
              disabled={!!editingDataIndex}
              onConfirm={handleDeleteLesson}
            />
          )}
        </Can>

        <Can
          I={ActionName.Delete}
          this={s(SubjectName.Journal, { userId: journalOwnerId })}
        >
          {() =>
            !lesson.conducted ? (
              <StartButton
                disabled={!!editingDataIndex}
                buttonSize={18}
                tooltipText="Начать занятие"
                onClick={handleStartLesson}
              />
            ) : undefined
          }
        </Can>
      </Space>

      <Can
        I={ActionName.Create}
        this={s(SubjectName.Journal, { userId: journalOwnerId })}
      >
        {() => (
          <AddItemButton
            disabled={!!editingDataIndex}
            tooltipText="Добавить колонку для баллов на эту дату"
            onClick={handleAddAnnotation}
          />
        )}
      </Can>
    </Row>
  );
};

export default memo(JournalTableLesson);

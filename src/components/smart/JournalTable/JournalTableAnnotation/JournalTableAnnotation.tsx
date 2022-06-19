import { message, Space, Popover, Row } from "antd";
import { FC, memo, useEffect } from "react";
import { ActionName, SubjectName } from "../../../../constants/permissions";
import { useAppDispatch } from "../../../../hooks/redux";
import { useDeleteAnnotationMutation } from "../../../../services/annotations/annotations.service";
import { deleteAnnotationAction } from "../../../../store/slices/journal/journal.slice";
import { s } from "../../../../utils/abilities";
import Can from "../../../simple/Can/Can";
import DeleteButton from "../../../simple/DeleteButton/DeleteButton";
import EditButton from "../../../simple/EditButton/EditButton";
import OkButton from "../../../simple/OkButton/OkButton";
import { JournalTableAnnotationProps } from "./JournalTableAnnotation.interface";

const JournalTableAnnotation: FC<JournalTableAnnotationProps> = ({
  annotation,
  lesson,
  form,
  journalId,
  journalOwnerId,
  isAnnotationEditing,
  editingDataIndex,
  setIsAddAnnotationModalVisible,
  setIsAnnotationEditing,
  setEditingDataIndex,
  setIsDeleteAnnotationLoading,
}) => {
  const dispatch = useAppDispatch();

  const [deleteAnnotationAPI, { isLoading: isDeleteAnnotationLoading }] =
    useDeleteAnnotationMutation();

  useEffect(() => {
    setIsDeleteAnnotationLoading(isDeleteAnnotationLoading);
  }, [isDeleteAnnotationLoading]);

  const handleEditAnnotation = () => {
    form.setFieldsValue({
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
      journalId: journalId,
      lessonId: annotation.lessonId,
    })
      .unwrap()
      .then((payload) => dispatch(deleteAnnotationAction(payload)))
      .catch(() => message.error("Произошла ошибка при удалении пояснения"));
  };

  const handleEditPoints = () => {
    setEditingDataIndex(`${annotation.id} points`);
  };

  const handleOkPoints = () => {
    setEditingDataIndex("");
  };

  return (
    <Row justify="space-between">
      <Popover
        content={
          <Space>
            {annotation.name || "Пояснение отсутствует"}
            <Can
              I={ActionName.Update}
              this={s(SubjectName.Journal, { userId: journalOwnerId })}
            >
              {() => (
                <EditButton
                  disabled={!!editingDataIndex}
                  tooltipText="Редактировать пояснение"
                  onClick={handleEditAnnotation}
                />
              )}
            </Can>
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
        <Space size="small">
          {lesson.conducted && (
            <Can
              I={ActionName.Update}
              this={s(SubjectName.Journal, { userId: journalOwnerId })}
            >
              {() => (
                <EditButton
                  disabled={!!editingDataIndex}
                  tooltipText="Редактировать баллы"
                  onClick={handleEditPoints}
                />
              )}
            </Can>
          )}

          <Can
            I={ActionName.Delete}
            this={s(SubjectName.Journal, { userId: journalOwnerId })}
          >
            {() => (
              <DeleteButton
                tooltipText="Удалить столбец с баллами"
                disabled={!!editingDataIndex}
                onConfirm={handleDeleteAnnotation}
              />
            )}
          </Can>
        </Space>
      ) : (
        <OkButton
          tooltipText="Подтвердить"
          buttonSize={20}
          onClick={handleOkPoints}
        />
      )}
    </Row>
  );
};

export default memo(JournalTableAnnotation);

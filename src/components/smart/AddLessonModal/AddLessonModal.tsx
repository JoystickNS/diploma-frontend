import { message, Modal } from "antd";
import { FC, memo } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import {
  ICreateLessonArgs,
  IUpdateLessonArgs,
} from "../../../services/lessons/lessons.interface";
import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from "../../../services/lessons/lessons.service";
import {
  addLessonAction,
  updateLessonAction,
} from "../../../store/slices/journal/journal.slice";
import AddLessonForm from "./AddLessonForm/AddLessonForm";
import { AddLessonModalProps } from "./AddLessonModal.interface";

const AddLessonModal: FC<AddLessonModalProps> = ({
  updateMode,
  journalId,
  lessons,
  lessonTopics,
  lessonTypes,
  subgroups,
  form,
  setIsModalVisible,
  ...props
}) => {
  const dispatch = useAppDispatch();

  const [createLessonAPI, { isLoading: isCreateLessonLoading }] =
    useCreateLessonMutation();
  const [updateLessonAPI, { isLoading: isUpdateLessonLoading }] =
    useUpdateLessonMutation();

  const createLesson = (body: ICreateLessonArgs) => {
    createLessonAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(addLessonAction(payload));
        setIsModalVisible(false);
      })
      .catch(() => message.error("Произошла ошибка при создании занятия"));
  };

  const updateLesson = (body: IUpdateLessonArgs) => {
    updateLessonAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(updateLessonAction(payload));
        setIsModalVisible(false);
      })
      .catch(() => message.error("Произошла ошибка при обновлении занятия"));
  };

  const onFinish = async () => {
    try {
      let body = { ...(await form.validateFields()), journalId };

      let subgroupIds: number[] = [];

      if (subgroups.length > 1) {
        if (body.subgroupIds === 0) {
          subgroupIds = subgroups.map((subgroup) => subgroup.id);
        } else {
          subgroupIds = [body.subgroupIds];
        }
      } else {
        subgroupIds = [subgroups[0].id];
      }

      body = {
        ...body,
        journalId,
        subgroupIds,
      };

      updateMode ? updateLesson(body) : createLesson(body);
    } catch (errInfo) {}
  };

  return (
    <Modal
      title={updateMode ? "Редактирование занятия" : "Добавление занятия"}
      centered
      destroyOnClose
      maskClosable={false}
      onOk={onFinish}
      okText={updateMode ? "Сохранить" : "Добавить"}
      okButtonProps={{
        loading: isCreateLessonLoading || isUpdateLessonLoading,
      }}
      onCancel={() => setIsModalVisible(false)}
      {...props}
    >
      <AddLessonForm
        form={form}
        updateMode={updateMode}
        lessons={lessons}
        lessonTypes={lessonTypes}
        lessonTopics={lessonTopics}
        subgroups={subgroups}
      />
    </Modal>
  );
};

export default memo(AddLessonModal);

AddLessonModal.defaultProps = {
  updateMode: false,
};

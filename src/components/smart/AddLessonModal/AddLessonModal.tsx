import { Modal } from "antd";
import { FC } from "react";
import AddLessonForm from "./AddLessonForm/AddLessonForm";
import { AddLessonModalProps } from "./AddLessonModal.interface";

const AddLessonModal: FC<AddLessonModalProps> = ({
  updateMode,
  journalId,
  lessonTopics,
  lessonTypes,
  subgroups,
  form,
  maxLecturesCount,
  maxPracticesCount,
  maxLaboratoriesCount,
  setIsModalVisible,
  ...props
}) => {
  return (
    <Modal
      title={updateMode ? "Редактирование занятия" : "Добавление занятия"}
      centered
      destroyOnClose
      maskClosable={false}
      footer={null}
      onOk={() => setIsModalVisible(false)}
      onCancel={() => setIsModalVisible(false)}
      {...props}
    >
      <AddLessonForm
        form={form}
        updateMode={updateMode}
        journalId={journalId}
        lessonTypes={lessonTypes}
        subgroups={subgroups}
        lessonTopics={lessonTopics}
        maxLecturesCount={maxLecturesCount}
        maxPracticesCount={maxPracticesCount}
        maxLaboratoriesCount={maxLaboratoriesCount}
        setIsModalVisible={setIsModalVisible}
      />
    </Modal>
  );
};

export default AddLessonModal;

AddLessonModal.defaultProps = {
  updateMode: false,
};

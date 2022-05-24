import { Modal } from "antd";
import { FC, memo } from "react";
import LessonDays from "./LessonDays/LessonDays";
import { ILessonDay } from "./LessonDays/LessonDays.interface";
import { LessonDaysModalProps } from "./LessonDaysModal.interface";

const LessonDaysModal: FC<LessonDaysModalProps> = ({
  title,
  isModalVisible,
  buttonRef,
  setDays,
  setIsModalVisible,
}) => {
  const handleAddDays = (
    values: ILessonDay[],
    buttonRef: React.RefObject<HTMLButtonElement>,
    setDays: (values: ILessonDay[]) => void,
    setModalVisible: (value: boolean) => void
  ) => {
    const days = values.map((value) => value.day);

    if (buttonRef?.current) {
      if (values.length > 0) {
        buttonRef.current.textContent = days.join(", ").toUpperCase();
      } else {
        buttonRef.current.textContent = "Нажмите для добавления";
      }
    }

    setDays(values);
    setModalVisible(false);
  };

  return (
    <Modal
      title={title}
      centered
      maskClosable={false}
      visible={isModalVisible}
      footer={null}
      onCancel={() => setIsModalVisible(false)}
    >
      <LessonDays
        onCancel={() => setIsModalVisible(false)}
        onOk={(values) =>
          handleAddDays(values, buttonRef, setDays, setIsModalVisible)
        }
      />
    </Modal>
  );
};

export default memo(LessonDaysModal);

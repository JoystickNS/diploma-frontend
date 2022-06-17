import { message, Modal } from "antd";
import { FC, memo } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import {
  ICreateAnnotationArgs,
  IUpdateAnnotationArgs,
} from "../../../services/annotations/annotations.interface";
import {
  useCreateAnnotationMutation,
  useUpdateAnnotationMutation,
} from "../../../services/annotations/annotations.service";
import {
  addAnnotationAction,
  updateAnnotationAction,
} from "../../../store/slices/journal/journal.slice";
import AddAnnotationForm from "./AddAnnotationForm/AddAnnotationForm";
import { AddAnnotationModalProps } from "./AddAnnotationModal.interface";

const AddAnnotationModal: FC<AddAnnotationModalProps> = ({
  updateMode,
  form,
  journalId,
  visible,
  setIsModalVisible,
  ...props
}) => {
  const dispatch = useAppDispatch();

  const [createAnnotationAPI, { isLoading: isCreateAnnotationLoading }] =
    useCreateAnnotationMutation();

  const [updateAnnotationAPI, { isLoading: isUpdateAnnotationLoading }] =
    useUpdateAnnotationMutation();

  const createAnnotation = (body: ICreateAnnotationArgs) => {
    createAnnotationAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(addAnnotationAction(payload));
        setIsModalVisible(false);
        const tableBody = document.querySelector(".ant-table-body");
        tableBody?.scrollBy({ left: 1 });
      })
      .catch(() => message.error("Произошла ошибка при добавлении пояснения"));
  };

  const updateAnnotation = (body: IUpdateAnnotationArgs) => {
    updateAnnotationAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(updateAnnotationAction(payload));
        setIsModalVisible(false);
        const tableBody = document.querySelector(".ant-table-body");
        tableBody?.scrollBy({ left: -1 });
      })
      .catch(() => message.error("Произошла ошибка при обновлении пояснения"));
  };

  const onFinish = async () => {
    try {
      const body = { ...(await form.validateFields()), journalId };

      updateMode ? updateAnnotation(body) : createAnnotation(body);
    } catch (errInfo) {}
  };

  return (
    <Modal
      title={updateMode ? "Редактирование колонки" : "Добавление колонки"}
      centered
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onOk={onFinish}
      okText={updateMode ? "Сохранить" : "Добавить"}
      okButtonProps={{
        loading: isCreateAnnotationLoading || isUpdateAnnotationLoading,
      }}
      onCancel={() => setIsModalVisible(false)}
      {...props}
    >
      <AddAnnotationForm form={form} updateMode={updateMode} />
    </Modal>
  );
};

export default memo(AddAnnotationModal);

AddAnnotationModal.defaultProps = {
  updateMode: false,
};

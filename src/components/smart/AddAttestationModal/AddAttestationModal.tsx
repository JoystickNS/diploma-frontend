import { message, Modal } from "antd";
import { FC } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import {
  useCreateAttestationMutation,
  useUpdateAttestationMutation,
} from "../../../services/attestations/attestations.service";
import { useGetWorkTypesQuery } from "../../../services/work-types/work-types.service";
import {
  addAttestationAction,
  updateAttestationAction,
} from "../../../store/slices/journal/journal.slice";
import AddAttestationForm from "./AddAttestationForm/AddAttestationForm";
import { AddAttestationModalProps } from "./AddAttestationModal.interface";

const AddAttestationModal: FC<AddAttestationModalProps> = ({
  updateMode,
  journalId,
  form,
  visible,
  setIsModalVisible,
  ...props
}) => {
  const dispatch = useAppDispatch();

  const { data: workTypesData } = useGetWorkTypesQuery();

  const [createAttestationAPI, { isLoading: isCreateAttestationLoading }] =
    useCreateAttestationMutation();
  const [updateAttestationAPI, { isLoading: isUpdateAttestationLoading }] =
    useUpdateAttestationMutation();

  const createAttestation = (body: any) => {
    createAttestationAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(addAttestationAction(payload));
        setIsModalVisible(false);
      })
      .catch(() =>
        message.error(
          "Произошла ошибка при добавлении промежуточной аттестации"
        )
      );
  };

  const updateAttestation = (body: any) => {
    updateAttestationAPI(body)
      .unwrap()
      .then((payload) => {
        dispatch(updateAttestationAction(payload));
        setIsModalVisible(false);
      })
      .catch(() =>
        message.error(
          "Произошла ошибка при обновлении промежуточной аттестации"
        )
      );
  };

  const onFinish = async () => {
    try {
      const body = { ...(await form.validateFields()), journalId };

      updateMode ? updateAttestation(body) : createAttestation(body);
    } catch (errInfo) {}
  };

  return (
    <Modal
      centered
      title={
        updateMode
          ? "Редактирование промежуточной аттестации"
          : "Добавление промежуточной аттестации"
      }
      onOk={onFinish}
      okText={updateMode ? "Сохранить" : "Добавить"}
      okButtonProps={{
        loading: isCreateAttestationLoading || isUpdateAttestationLoading,
      }}
      onCancel={() => setIsModalVisible(false)}
      maskClosable={false}
      visible={visible}
      {...props}
    >
      <AddAttestationForm
        form={form}
        workTypes={workTypesData || []}
        updateMode={updateMode}
      />
    </Modal>
  );
};

export default AddAttestationModal;

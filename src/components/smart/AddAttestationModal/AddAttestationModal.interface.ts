import { FormInstance, ModalProps } from "antd";

export interface AddAttestationModalProps extends ModalProps {
  updateMode?: boolean;
  journalId: number;
  form: FormInstance<any>;
  setIsModalVisible: (value: boolean) => void;
}

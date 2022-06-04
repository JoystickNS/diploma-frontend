import { ModalProps, FormInstance } from "antd";

export interface AddAnnotationModalProps extends ModalProps {
  updateMode?: boolean;
  visible: boolean;
  journalId: number;
  form: FormInstance<any>;
  setIsModalVisible: (value: boolean) => void;
}

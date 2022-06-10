import { FormInstance } from "antd";
import { IAttestation } from "../../../../models/IAttestation";

export interface JournalTableAttestationProps {
  attestation: IAttestation;
  journalId: number;
  form: FormInstance<any>;
  isAttestationEditing: boolean;
  editingDataIndex: string;
  setIsAttestationEditing: (value: boolean) => void;
  setIsAddAttestationModalVisible: (value: boolean) => void;
  setIsDeleteAttestationLoading: (value: boolean) => void;
}

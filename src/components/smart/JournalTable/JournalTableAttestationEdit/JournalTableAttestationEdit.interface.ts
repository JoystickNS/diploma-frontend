export interface JournalTableAttestationEditProps {
  attestationId: number;
  columnName: string;
  editingDataIndex: string;
  setEditingDataIndex: (value: string) => void;
  setEndEditingDataIndex: (value: string) => void;
}

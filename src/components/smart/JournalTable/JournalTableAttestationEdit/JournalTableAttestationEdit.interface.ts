export interface JournalTableAttestationEditProps {
  attestationId: number;
  columnName: string;
  editingDataIndex: string;
  journalOwnerId: number;
  setEditingDataIndex: (value: string) => void;
  setEndEditingDataIndex: (value: string) => void;
}

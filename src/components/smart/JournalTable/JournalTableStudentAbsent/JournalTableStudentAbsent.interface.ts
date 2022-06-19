export interface JournalTableStudentAbsentProps {
  journalOwnerId: number;
  lessonId: number;
  lessonConducted: boolean;
  editingDataIndex: string;
  setEditingDataIndex: (value: string) => void;
  setEndEditingDataIndex: (value: string) => void;
}

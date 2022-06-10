export interface JournalTableStudentAbsentProps {
  lessonId: number;
  lessonConducted: boolean;
  editingDataIndex: string;
  setEditingDataIndex: (value: string) => void;
  setEndEditingDataIndex: (value: string) => void;
}

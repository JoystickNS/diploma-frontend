export interface JournalEditableCellProps
  extends React.HTMLAttributes<HTMLElement> {
  isEditing: boolean;
  dataIndex: string;
  journalId: number;
  studentId: number;
  studentSubgroupId: number;
  isAbsent: boolean;
  lessonId: number;
  lessonSubgroupId: number;
  annotationId: number;
  attestationId: number;
  pointId: number;
  numberOfPoints: number;
  lessonConducted: boolean;
  credited: boolean;
  attestationPoints: number;
  attestationGrade: number;
  children: React.ReactNode;
}

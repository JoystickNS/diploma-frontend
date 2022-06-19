import { FormInstance } from "antd";
import { ILesson } from "../../../../models/ILesson";

export interface JournalTableLessonProps {
  journalId: number;
  journalOwnerId: number;
  lesson: ILesson;
  subgroupsCount: number;
  annotationForm: FormInstance<any>;
  lessonForm: FormInstance<any>;
  isAnnotationEditing: boolean;
  editingDataIndex: string;
  isSomeStudentWithoutSubgroup: boolean;
  isLessonEditing: boolean;
  setIsLessonEditing: (value: boolean) => void;
  setEditingDataIndex: (value: string) => void;
  setIsAnnotationEditing: (value: boolean) => void;
  setIsAddAnnotationModalVisible: (value: boolean) => void;
  setIsAddLessonModalVisible: (value: boolean) => void;
  setIsStartLessonLoading: (value: boolean) => void;
  setIsDeleteLessonLoading: (value: boolean) => void;
}

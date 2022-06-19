import { FormInstance } from "antd";
import { IAnnotation } from "../../../../models/IAnnotation";
import { ILesson } from "../../../../models/ILesson";

export interface JournalTableAnnotationProps {
  annotation: IAnnotation;
  lesson: ILesson;
  journalId: number;
  journalOwnerId: number;
  form: FormInstance<any>;
  isAnnotationEditing: boolean;
  editingDataIndex: string;
  setIsAnnotationEditing: (value: boolean) => void;
  setIsAddAnnotationModalVisible: (value: boolean) => void;
  setIsDeleteAnnotationLoading: (value: boolean) => void;
  setEditingDataIndex: (value: string) => void;
}

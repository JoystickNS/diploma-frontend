import { IPoint } from "../../../models/IPoint";
import { IVisit } from "../../../models/IVisit";

export interface EditableJournalHeaderCellProps {
  id: number;
  title: React.ReactNode;
  isEditable: boolean;
  children: React.ReactNode;
  dataIndex: any;
  lessonType: string;
}

export interface StudentVisit extends IVisit {
  lessonId: number;
}

export interface StudentPoint extends IPoint {
  lessonId: number;
}

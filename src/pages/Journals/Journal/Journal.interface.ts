import { IAnnotation } from "../../../models/IAnnotation";
import { ILesson } from "../../../models/ILesson";
import { IPoint } from "../../../models/IPoint";
import { ISubgroup } from "../../../models/ISubgroup";
import { IVisit } from "../../../models/IVisit";

export interface EditableJournalHeaderCellProps {
  id: number;
  title: React.ReactNode;
  isEditable: boolean;
  children: React.ReactNode;
  dataIndex: any;
  lessonType: string;
}

export interface IStudentPoint extends IPoint {
  lessonId: number;
}

export interface IJournalTable {
  key: number;
  studentName: string;
  subgroup: ISubgroup;
  lessons?: ILesson[];
  annotations?: IAnnotation[];
  visits?: IVisit[];
  [key: string]: any;
}

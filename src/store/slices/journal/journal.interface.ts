import { IDictionary } from "../../../models/IDictionary";
import { IJournalFullInfo } from "../../../models/IJournalFullInfo";
import { ILessonTopic } from "../../../models/ILessonTopic";

export interface IVisitInProgress {
  lessonId: number;
  studentId: number;
}

export interface IStudentSubgroupAction {
  studentId: number;
  value: number;
}

export interface ILessonUpdateAction {
  id: number;
  date: moment.Moment;
  topic: ILessonTopic;
  type: IDictionary;
}

export interface IJournalState extends IJournalFullInfo {
  visitsInProgress: IVisitInProgress[];
}

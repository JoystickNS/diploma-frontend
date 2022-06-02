import { IDictionary } from "../../../models/IDictionary";
import { ILessonTopic } from "../../../models/ILessonTopic";

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

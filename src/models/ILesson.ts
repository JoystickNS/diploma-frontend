import moment from "moment";
import { IDictionary } from "./IDictionary";
import { ILessonTopic } from "./ILessonTopic";
import { ISubgroup } from "./ISubgroup";

export interface ILesson {
  id: number;
  date: moment.Moment;
  conducted: boolean;
  lessonTopic: ILessonTopic;
  lessonType: IDictionary;
  subgroups: ISubgroup[];
}

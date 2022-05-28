import moment from "moment";
import { ILessonTopic } from "./ILessonTopic";
import { IPoint } from "./IPoint";
import { ISubgroup } from "./ISubgroup";
import { IVisit } from "./IVisit";

export interface ILesson {
  id: number;
  date: moment.Moment;
  conducted: boolean;
  topic: ILessonTopic;
  subgroups: ISubgroup[];
  points: IPoint[];
  visits: IVisit[];
}

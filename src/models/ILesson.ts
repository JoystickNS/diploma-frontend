import moment from "moment";

export interface ILesson {
  id: number;
  date: moment.Moment;
  topic: string;
  type: string;
}

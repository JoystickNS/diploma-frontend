import moment from "moment";

export interface IGetLessonsArgs {
  journalId?: string;
}

export interface IUpdateLessonArgs {
  id: number;
  topic?: string;
  date?: moment.Moment;
}

export interface IUpdateManyLessonsArgs {
  items: IUpdateLessonArgs[];
}

import moment from "moment";

export interface ICreateLessonArgs {
  journalId: number;
  lessonTypeId: number;
  lessonTopicId?: number;
  subgroupIds: number[];
  date: moment.Moment;
}

export interface ICreateManyLessonsArgs {
  items: ICreateLessonArgs[];
}

export interface IGetLessonsArgs {
  journalId?: string;
}

export interface IUpdateLessonArgs extends ICreateLessonArgs {
  lessonId: number;
}

export interface IUpdateManyLessonsArgs {
  items: IUpdateLessonArgs[];
}

export interface IDeleteLessonArgs {
  lessonId: number;
  journalId: number;
  subgroupId: number;
}

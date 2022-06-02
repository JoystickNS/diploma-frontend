import { ILesson } from "../models/ILesson";

export const sortLessonsByDate = (a: ILesson, b: ILesson) =>
  a.date > b.date ? 1 : -1;

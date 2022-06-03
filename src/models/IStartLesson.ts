import { IVisit } from "./IVisit";

export interface IStartLesson {
  lessonId: number;
  visits: IVisit[];
}

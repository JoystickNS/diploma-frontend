import { IAnnotation } from "./IAnnotation";
import { IAttestation } from "./IAttestation";
import { IDictionary } from "./IDictionary";
import { ILesson } from "./ILesson";
import { ILessonTopic } from "./ILessonTopic";
import { IPoint } from "./IPoint";
import { IStudent } from "./IStudent";
import { ISubgroup } from "./ISubgroup";
import { IVisit } from "./IVisit";

export interface IJournalFullInfo {
  id: number;
  annotations: IAnnotation[];
  attestations: IAttestation[];
  control: IDictionary;
  discipline: IDictionary;
  group: IDictionary;
  laboratoryHours: number;
  lectureHours: number;
  lessons: ILesson[];
  lessonTypes: IDictionary[];
  lessonTopics: ILessonTopic[];
  maximumPoints?: number;
  practiceHours: number;
  semester: number;
  students: IStudent[];
  subgroups: ISubgroup[];
  points: IPoint[];
  visits: IVisit[];
}

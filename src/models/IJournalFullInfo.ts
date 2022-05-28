import { IAttestation } from "./IAttestation";
import { IDictionary } from "./IDictionary";
import { ILesson } from "./ILesson";
import { ILessonTopic } from "./ILessonTopic";
import { IStudent } from "./IStudent";
import { ISubgroup } from "./ISubgroup";

export interface IJournalFullInfo {
  id: number;
  discipline: IDictionary;
  group: IDictionary;
  subgroups: ISubgroup[];
  semester: number;
  control: IDictionary;
  lectureHours: number;
  practiceHours: number;
  laboratoryHours: number;
  maximumPoints?: number;
  lessons: ILesson[];
  lectureTopics: ILessonTopic[];
  practiceTopics: ILessonTopic[];
  laboratoryTopics: ILessonTopic[];
  attestations: IAttestation[];
  students: IStudent[];
}

import { IAttestation } from "./IAttestation";
import { IDictionary } from "./IDictionary";
import { ILessonTopic } from "./ILessonTopic";

export interface IJournalUmkInfo {
  control: IDictionary;
  lectureHours: number;
  practiceHours: number;
  laboratoryHours: number;
  pointsForThree?: number;
  pointsForFour?: number;
  pointsForFive?: number;
  maximumPoints?: number;
  attestations: IAttestation[];
  lectureTopics: ILessonTopic[];
  practiceTopics: ILessonTopic[];
  laboratoryTopics: ILessonTopic[];
}

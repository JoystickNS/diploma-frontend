import { IAttestation } from "./IAttestation";
import { ILessonTopic } from "./ILessonTopic";

export interface IJournalUmkInfo {
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

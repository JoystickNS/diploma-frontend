import { IAttestation } from "./IAttestation";
import { ILessonTopic } from "./ILessonTopic";

export interface IJournalUmkInfo {
  lectureHours: number;
  practiceHours: number;
  laboratoryHours: number;
  pointsForThree: number | null;
  pointsForFour: number | null;
  pointsForFive: number | null;
  maximumPoints: number | null;
  attestations: IAttestation[];
  lectureTopics: ILessonTopic[];
  practiceTopics: ILessonTopic[];
  laboratoryTopics: ILessonTopic[];
}

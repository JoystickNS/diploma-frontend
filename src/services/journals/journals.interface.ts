import { IAttestation } from "../../models/IAttestation";
import { ILessonTopic } from "../../models/ILessonTopic";

export interface ICreateJournalArgs {
  discipline: string;
  control: string;
  lectureHours: number;
  practiceHours: number;
  laboratoryHours: number;
  maximumPoints?: number;
  pointsForThree?: number;
  pointsForFour?: number;
  pointsForFive?: number;
  attestations?: IAttestation;
  lectureTopics?: ILessonTopic[];
  practiceTopics?: ILessonTopic[];
  laboratoryTopics?: ILessonTopic[];
}

export interface IJournalListArgs {
  discipline?: string;
}

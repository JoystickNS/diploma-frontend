import { IAttestation } from "../../models/IAttestation";
import { ILessonTopic } from "../../models/ILessonTopic";
import { IQueryArg } from "../api.interface";

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

export interface IUpdateJournalArgs {
  journalId: number;
  deleted: boolean;
  lectureHours?: number;
  practiceHours?: number;
  laboratoryHours?: number;
  maximumPoints?: number;
  pointsForThree?: number;
  pointsForFour?: number;
  pointsForFive?: number;
}

export interface IGetJournalListArgs extends IQueryArg {
  disciplineId?: number;
  groupId?: number;
}

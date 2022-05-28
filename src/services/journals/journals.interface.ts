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

export interface ICreateJournalSubgroupArgs {
  journalId: number;
  group: string;
  subgroup: number;
}

export interface IUpdateJournalSubgroupStudentArgs {
  journalId: number;
  studentId: number;
  subgroupId: number;
  newSubgroupId: number;
}

export interface IUpdateJournalSubgroupsStudentsArgs {
  items: IUpdateJournalSubgroupStudentArgs[];
}

export interface IDeleteJournalSubgroupArgs {
  journalId: number;
  subgroupId: number;
}

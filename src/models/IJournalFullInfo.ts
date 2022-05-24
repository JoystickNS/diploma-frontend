import { IAttestation } from "./IAttestation";
import { ILesson } from "./ILesson";

export interface IJournalFullInfo {
  discipline: string;
  group: string;
  semester: number;
  control: string;
  lectureHours: number;
  practiceHours: number;
  laboratoryHours: number;
  maximumPoints?: number;
  lessons: ILesson[];
  attestations: IAttestation[];
}

import { IDictionary } from "./IDictionary";

export interface ISemesterGroupReport {
  disciplines: IDictionary[];
  group: string;
  semester: number;
  students: {
    id: number;
    lastName: string;
    firstName: string;
    middleName: string;
    performances: {
      disciplineId: number;
      absenteeismCount: number;
      pointsCount: number;
    }[];
  }[];
}

import { ISubgroup } from "./ISubgroup";

export interface IStudent {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  subgroup: ISubgroup;
}

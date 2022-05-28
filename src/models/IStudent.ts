import { ISubgroup } from "./ISubgroup";

export interface IStudent {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  subgroup: ISubgroup;
}

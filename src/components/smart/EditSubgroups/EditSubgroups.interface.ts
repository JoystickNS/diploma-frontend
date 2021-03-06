import { IStudent } from "../../../models/IStudent";
import { ISubgroup } from "../../../models/ISubgroup";

export interface EditSubgroupsProps {
  groupId: number;
  journalId: number;
  students: IStudent[];
  subgroups: ISubgroup[];
}

export interface IEditSubgroupsTable {
  key: number;
  studentName: string;
  subgroup: ISubgroup;
}

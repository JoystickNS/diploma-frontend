import { ISubgroup } from "../../../../models/ISubgroup";

export interface JournalTableStudentNameProps {
  subgroupsCount: number;
  studentName: string;
  isSubgroup: ISubgroup;
  setIsModalVisible: (value: boolean) => void;
}

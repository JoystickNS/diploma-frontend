export interface ICreateSubgroupArgs {
  journalId: number;
  groupId: number;
  subgroup: number;
}

export interface ICreateSubgroupStudentArgs {
  journalId: number;
  subgroupId: number;
  studentId: number;
}

export interface IUpdateSubgroupStudentArgs {
  subgroupId: number;
  journalId: number;
  studentId: number;
  newSubgroupId: number;
}

export interface IUpdateSubgroupsStudentsArgs {
  items: IUpdateSubgroupStudentArgs[];
}

export interface IDeleteSubgroupArgs {
  subgroupId: number;
  journalId: number;
}

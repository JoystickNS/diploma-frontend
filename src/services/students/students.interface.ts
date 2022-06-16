export interface IImportStudentAndGroupArgs {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  group: string;
  passportID: string;
  recordBookID: string;
  academ: number;
  startYear: number;
}

export interface IImportManyStudentsAndGroupsArgs {
  students: IImportStudentAndGroupArgs[];
}

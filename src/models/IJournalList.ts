export interface IJournalList {
  id: number;
  deleted: boolean;
  discipline: string;
  group: string;
  user: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  semester: number;
}

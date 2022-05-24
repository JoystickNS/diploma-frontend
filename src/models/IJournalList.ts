export interface IJournalList {
  id: number;
  discipline: string;
  group: string;
  user: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  semester: number;
}

export interface ICreatePointArgs {
  journalId: number;
  lessonId: number;
  studentId: number;
  annotationId: number;
  numberOfPoints?: number;
}

export interface IUpdatePointArgs extends ICreatePointArgs {
  pointId: number;
}

export interface IDeletePointArgs extends IUpdatePointArgs {}

export interface ICreateAnnotationArgs {
  journalId: number;
  lessonId: number;
  name?: string;
}

export interface IUpdateAnnotationArgs extends ICreateAnnotationArgs {
  annotationId: number;
}

export interface IDeleteAnnotationArgs {
  journalId: number;
  lessonId: number;
  annotationId: number;
}

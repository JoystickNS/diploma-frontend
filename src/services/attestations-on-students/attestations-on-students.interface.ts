export interface ICreateAttestationOnStudentArgs {
  attestationId: number;
  journalId: number;
  studentId: number;
}

export interface IUpdateAttestationOnStudentArgs
  extends ICreateAttestationOnStudentArgs {
  credited?: boolean;
  points?: number;
  grade?: number;
}

export interface IDeleteAttestationOnStudentArgs {
  attestationId: number;
  studentId: number;
  journalId: number;
}

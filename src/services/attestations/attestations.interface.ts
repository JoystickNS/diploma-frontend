export interface ICreateAttestationArgs {
  journalId: number;
  workTypeId?: string;
  workTopic?: string;
  maximumPoints?: number;
}

export interface IUpdateAttestationArgs extends ICreateAttestationArgs {
  attestationId: number;
}

export interface IDeleteAttestationArgs {
  journalId: number;
  attestationId: number;
}

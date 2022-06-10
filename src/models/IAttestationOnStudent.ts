export interface IAttestationOnStudent {
  attestationId: number;
  studentId: number;
  credited?: boolean;
  points?: number;
  grade?: number;
}

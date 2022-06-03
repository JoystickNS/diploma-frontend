import { IDictionary } from "./IDictionary";

export interface IAttestation {
  id: number;
  workType: IDictionary;
  workTopic?: string;
  maximumPoints?: number;
}

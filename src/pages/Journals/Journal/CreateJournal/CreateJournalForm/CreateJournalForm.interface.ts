import { IDictionary } from "../../../../../models/IDictionary";

export interface IAttestationTable {
  key: number;
  workType?: IDictionary;
  workTopic?: string;
  maximumPoints?: number;
}

import { subject } from "@casl/ability";
import { SubjectName } from "../constants/permissions";

export const s = (subjectName: SubjectName, obj: Record<PropertyKey, any>) => {
  const result = {
    userId: obj.userId,
  };

  return subject(subjectName, result);
};

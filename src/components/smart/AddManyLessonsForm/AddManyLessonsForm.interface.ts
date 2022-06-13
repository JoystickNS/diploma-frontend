import { ILesson } from "../../../models/ILesson";
import { ISubgroup } from "../../../models/ISubgroup";

export interface AddManyLessonsFormProps {
  journalId: number;
  lessons: ILesson[];
  maxLecturesCount: number;
  maxPracticesCount: number;
  maxLaboratoriesCount: number;
  subgroups: ISubgroup[];
  setIsModalVisible: (value: boolean) => void;
}

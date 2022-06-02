import { IDictionary } from "../../../models/IDictionary";
import { ILesson } from "../../../models/ILesson";
import { ISubgroup } from "../../../models/ISubgroup";

export interface AddManyLessonsFormProps {
  journalId: number;
  lessons: ILesson[];
  maxLecturesCount: number;
  maxPracticesCount: number;
  maxLaboratoriesCount: number;
  lessonTypes: IDictionary[];
  subgroups: ISubgroup[];
  setIsModalVisible: (value: boolean) => void;
}

import { ILesson } from "../../../models/ILesson";

export interface AddLessonDaysFormProps {
  lessons: ILesson[];
  lecturesCount: number;
  practicesCount: number;
  laboratoriesCount: number;
  setIsModalVisible: (value: boolean) => void;
}

import { ILessonDay } from "./LessonDays/LessonDays.interface";

export interface LessonDaysModalProps {
  title: string;
  isModalVisible: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
  setDays: (values: ILessonDay[]) => void;
  setIsModalVisible: (value: boolean) => void;
}

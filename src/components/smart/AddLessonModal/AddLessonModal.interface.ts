import { ModalProps, FormInstance } from "antd";
import { ILesson } from "../../../models/ILesson";
import { ILessonTopic } from "../../../models/ILessonTopic";
import { ISubgroup } from "../../../models/ISubgroup";

export interface AddLessonModalProps extends ModalProps {
  updateMode?: boolean;
  journalId: number;
  lessons: ILesson[];
  subgroups: ISubgroup[];
  lessonTopics: ILessonTopic[];
  form: FormInstance<any>;
  setIsModalVisible: (value: boolean) => void;
}

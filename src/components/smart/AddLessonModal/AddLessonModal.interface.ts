import { ModalProps, FormInstance } from "antd";
import { IDictionary } from "../../../models/IDictionary";
import { ILessonTopic } from "../../../models/ILessonTopic";
import { ISubgroup } from "../../../models/ISubgroup";

export interface AddLessonModalProps extends ModalProps {
  updateMode?: boolean;
  journalId: number;
  lessonTypes: IDictionary[];
  subgroups: ISubgroup[];
  lessonTopics: ILessonTopic[];
  maxLecturesCount: number;
  maxPracticesCount: number;
  maxLaboratoriesCount: number;
  form: FormInstance<any>;
  setIsModalVisible: (value: boolean) => void;
}

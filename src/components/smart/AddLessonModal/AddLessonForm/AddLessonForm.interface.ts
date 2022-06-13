import { FormInstance } from "antd";
import { ILesson } from "../../../../models/ILesson";
import { ILessonTopic } from "../../../../models/ILessonTopic";
import { ISubgroup } from "../../../../models/ISubgroup";

export interface AddLessonFormProps {
  lessons: ILesson[];
  lessonTopics: ILessonTopic[];
  subgroups: ISubgroup[];
  updateMode?: boolean;
  form: FormInstance<any>;
}

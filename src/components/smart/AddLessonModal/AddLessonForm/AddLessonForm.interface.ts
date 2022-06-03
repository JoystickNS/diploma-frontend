import { FormInstance } from "antd";
import { IDictionary } from "../../../../models/IDictionary";
import { ILesson } from "../../../../models/ILesson";
import { ILessonTopic } from "../../../../models/ILessonTopic";
import { ISubgroup } from "../../../../models/ISubgroup";

export interface AddLessonFormProps {
  lessons: ILesson[];
  lessonTypes: IDictionary[];
  lessonTopics: ILessonTopic[];
  subgroups: ISubgroup[];
  updateMode?: boolean;
  form: FormInstance<any>;
}

import { TableProps } from "antd";
import { Dispatch, SetStateAction } from "react";
import { ILessonTopic } from "../../../models/ILessonTopic";
import { IAttestationTable } from "../../../pages/Journals/Journal/CreateJournal/CreateJournalForm/CreateJournalForm.interface";

export interface ILessonTopicTable extends Pick<ILessonTopic, "name"> {
  key: number;
  isEditable?: boolean;
}

export interface LessonTopicTableProps extends TableProps<ILessonTopicTable> {
  lessonHours: number;
  lessonTopics: ILessonTopicTable[];
  setLessonTopics: Dispatch<SetStateAction<ILessonTopicTable[]>>;
}

export interface EditableLessonTopicCellProps
  extends React.HTMLAttributes<HTMLElement> {
  isEditing: boolean;
  dataIndex: string;
  record: IAttestationTable;
  children: React.ReactNode;
}

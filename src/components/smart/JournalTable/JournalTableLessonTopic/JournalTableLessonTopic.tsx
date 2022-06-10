import { Popover } from "antd";
import { FC, memo } from "react";
import { JournalTableLessonTopicProps } from "./JournalTableLessonTopic.interface";

const JournalTableLessonTopic: FC<JournalTableLessonTopicProps> = ({
  lessonTopic,
}) => {
  console.log("RENDER LessonTopic");
  return (
    <Popover content={lessonTopic || "Тема занятия отсутствует"}>
      <div style={{ overflow: "hidden", height: "24px" }}>
        {lessonTopic || "Тема занятия отсутствует"}
      </div>
    </Popover>
  );
};

export default memo(JournalTableLessonTopic);

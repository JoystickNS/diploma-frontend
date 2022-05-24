import { FC, useState } from "react";
import DeleteButton from "../../components/smart/DeleteButton/DeleteButton";
import LessonTopicTable from "../../components/smart/LessonTopicTable/LessonTopicTable";
import { ILessonTopicTable } from "../../components/smart/LessonTopicTable/LessonTopicTable.interface";

const Reports: FC = () => {
  // return <div>СТРАНИЦА С ОТЧЁТАМИ</div>;
  const [lectureTopicsData, setLectureTopicsData] = useState<
    ILessonTopicTable[]
  >([]);
  console.log(lectureTopicsData);
  console.log("RENDER REPORTS");
  return (
    <>
      <LessonTopicTable
        lessonHours={12}
        lessonTopics={lectureTopicsData}
        setLessonTopics={setLectureTopicsData}
      />
      <DeleteButton onConfirm={() => {}} />
    </>
  );
};

export default Reports;

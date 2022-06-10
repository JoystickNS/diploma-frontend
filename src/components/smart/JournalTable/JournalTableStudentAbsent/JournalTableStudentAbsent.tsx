import { Space } from "antd";
import { FC, memo } from "react";
import EditButton from "../../../simple/EditButton/EditButton";
import OkButton from "../../../simple/OkButton/OkButton";
import { JournalTableStudentAbsentProps } from "./JournalTableStudentAbsent.interface";

const JournalTableStudentAbsent: FC<JournalTableStudentAbsentProps> = ({
  lessonId,
  lessonConducted,
  editingDataIndex,
  setEditingDataIndex,
  setEndEditingDataIndex,
}) => {
  const dataIndex = `${lessonId} isAbsent`;

  console.log("RENDER StudentAbsent");

  const handleEditVisit = () => {
    setEditingDataIndex(dataIndex);
  };

  const handleOkVisit = () => {
    setEditingDataIndex("");
    setEndEditingDataIndex(dataIndex);
  };

  return (
    <Space>
      <div>Посещения</div>
      {lessonConducted &&
        (editingDataIndex !== dataIndex ? (
          <EditButton
            disabled={!!editingDataIndex}
            tooltipText="Редактировать посещения"
            onClick={handleEditVisit}
          />
        ) : (
          <OkButton
            tooltipText="Подтвердить"
            buttonSize={20}
            onClick={handleOkVisit}
          />
        ))}
    </Space>
  );
};

export default memo(JournalTableStudentAbsent);

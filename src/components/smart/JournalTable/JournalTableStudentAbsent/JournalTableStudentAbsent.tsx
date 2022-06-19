import { Space } from "antd";
import { FC, memo } from "react";
import { ActionName, SubjectName } from "../../../../constants/permissions";
import { s } from "../../../../utils/abilities";
import Can from "../../../simple/Can/Can";
import EditButton from "../../../simple/EditButton/EditButton";
import OkButton from "../../../simple/OkButton/OkButton";
import { JournalTableStudentAbsentProps } from "./JournalTableStudentAbsent.interface";

const JournalTableStudentAbsent: FC<JournalTableStudentAbsentProps> = ({
  journalOwnerId,
  lessonId,
  lessonConducted,
  editingDataIndex,
  setEditingDataIndex,
  setEndEditingDataIndex,
}) => {
  const dataIndex = `${lessonId} isAbsent`;

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
      <Can
        I={ActionName.Update}
        this={s(SubjectName.Journal, { userId: journalOwnerId })}
      >
        {() =>
          lessonConducted &&
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
          ))
        }
      </Can>
    </Space>
  );
};

export default memo(JournalTableStudentAbsent);

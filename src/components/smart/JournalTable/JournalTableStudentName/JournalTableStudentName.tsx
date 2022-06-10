import { Tooltip } from "antd";
import { FC, memo } from "react";
import { JournalTableStudentNameProps } from "./JournalTableStudentName.interface";

const JournalTableStudentName: FC<JournalTableStudentNameProps> = ({
  subgroupsCount,
  isSubgroup,
  studentName,
  setIsModalVisible,
}) => {
  console.log("RENDER StudentName");
  return (
    <div style={{ textAlign: "left", color: isSubgroup ? "black" : "red" }}>
      {isSubgroup ? (
        subgroupsCount === 1 ? (
          studentName
        ) : (
          `${studentName} (${isSubgroup.subgroupNumber.value})`
        )
      ) : (
        <Tooltip title="Не назначена подгруппа" color="black">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setIsModalVisible(true)}
          >
            {studentName}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default memo(JournalTableStudentName);

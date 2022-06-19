import { Space } from "antd";
import React, { FC } from "react";
import { ActionName, SubjectName } from "../../../../constants/permissions";
import { s } from "../../../../utils/abilities";
import Can from "../../../simple/Can/Can";
import EditButton from "../../../simple/EditButton/EditButton";
import OkButton from "../../../simple/OkButton/OkButton";
import { JournalTableAttestationEditProps } from "./JournalTableAttestationEdit.interface";

const JournalTableAttestationEdit: FC<JournalTableAttestationEditProps> = ({
  attestationId,
  columnName,
  editingDataIndex,
  journalOwnerId,
  setEditingDataIndex,
  setEndEditingDataIndex,
}) => {
  const dataIndex = `${attestationId} attestation`;

  const handleAttestationEdit = () => {
    setEditingDataIndex(dataIndex);
  };

  const handleAttestationOk = () => {
    setEditingDataIndex("");
    setEndEditingDataIndex(dataIndex);
  };

  return (
    <Space>
      <div>{columnName}</div>
      <Can
        I={ActionName.Update}
        this={s(SubjectName.Journal, { userId: journalOwnerId })}
      >
        {editingDataIndex !== dataIndex ? (
          <EditButton
            disabled={!!editingDataIndex}
            tooltipText="Редактировать"
            onClick={handleAttestationEdit}
          />
        ) : (
          <OkButton
            tooltipText="Подтвердить"
            buttonSize={20}
            onClick={handleAttestationOk}
          />
        )}
      </Can>
    </Space>
  );
};

export default JournalTableAttestationEdit;

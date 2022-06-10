import { Space } from "antd";
import React, { FC } from "react";
import EditButton from "../../../simple/EditButton/EditButton";
import OkButton from "../../../simple/OkButton/OkButton";
import { JournalTableAttestationEditProps } from "./JournalTableAttestationEdit.interface";

const JournalTableAttestationEdit: FC<JournalTableAttestationEditProps> = ({
  attestationId,
  columnName,
  editingDataIndex,
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
    </Space>
  );
};

export default JournalTableAttestationEdit;

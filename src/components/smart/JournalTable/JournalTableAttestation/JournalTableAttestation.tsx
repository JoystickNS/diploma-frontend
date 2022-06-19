import { message, Space } from "antd";
import { FC, memo, useEffect } from "react";
import { ActionName, SubjectName } from "../../../../constants/permissions";
import { useAppDispatch } from "../../../../hooks/redux";
import { useDeleteAttestationMutation } from "../../../../services/attestations/attestations.service";
import { deleteAttestationAction } from "../../../../store/slices/journal/journal.slice";
import { s } from "../../../../utils/abilities";
import Can from "../../../simple/Can/Can";
import DeleteButton from "../../../simple/DeleteButton/DeleteButton";
import EditButton from "../../../simple/EditButton/EditButton";
import { JournalTableAttestationProps } from "./JournalTableAttestation.interface";

const JournalTableAttestation: FC<JournalTableAttestationProps> = ({
  attestation,
  form,
  journalId,
  journalOwnerId,
  isAttestationEditing,
  editingDataIndex,
  setIsAddAttestationModalVisible,
  setIsAttestationEditing,
  setIsDeleteAttestationLoading,
}) => {
  const dispatch = useAppDispatch();

  const [deleteAttestationAPI, { isLoading: isDeleteAttestationLoading }] =
    useDeleteAttestationMutation();

  useEffect(() => {
    setIsDeleteAttestationLoading(isDeleteAttestationLoading);
  }, [isDeleteAttestationLoading]);

  const handleEditAttestation = () => {
    form.setFieldsValue({
      attestationId: attestation.id,
      workTypeId: attestation.workType?.id,
      workTopic: attestation.workTopic,
      maximumPoints: attestation.maximumPoints,
    });

    if (!isAttestationEditing) {
      setIsAttestationEditing(true);
    }

    setIsAddAttestationModalVisible(true);
  };

  const handleDeleteAttestation = () => {
    deleteAttestationAPI({
      journalId: journalId,
      attestationId: attestation.id,
    })
      .unwrap()
      .then((payload) => dispatch(deleteAttestationAction(payload)))
      .catch(() => message.error("Произошла ошибка при удалении аттестации"));
  };

  const title = attestation.maximumPoints
    ? `${attestation.workType?.name} (макс. ${attestation.maximumPoints})`
    : attestation.workType?.name;

  return (
    <Space>
      {title}
      <Can
        I={ActionName.Update}
        this={s(SubjectName.Journal, { userId: journalOwnerId })}
      >
        <EditButton
          tooltipText="Редактировать промежуточную аттестацию"
          onClick={handleEditAttestation}
          disabled={!!editingDataIndex}
        />
      </Can>

      <Can
        I={ActionName.Delete}
        this={s(SubjectName.Journal, { userId: journalOwnerId })}
      >
        <DeleteButton
          tooltipText="Удалить аттестацию"
          onConfirm={handleDeleteAttestation}
          disabled={!!editingDataIndex}
        />
      </Can>
    </Space>
  );
};

export default memo(JournalTableAttestation);

import { message, Checkbox, Row, Input, Form, Select } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { memo, useContext, useState } from "react";
import { useAppDispatch } from "../../../../hooks/redux";
import { IUpdateAttestationOnStudentArgs } from "../../../../services/attestations-on-students/attestations-on-students.interface";
import {
  useCreateAttestationOnStudentMutation,
  useUpdateAttestationOnStudentMutation,
} from "../../../../services/attestations-on-students/attestations-on-students.service";
import { IUpdatePointArgs } from "../../../../services/points/points.interface";
import {
  useCreatePointMutation,
  useDeletePointMutation,
  useUpdatePointMutation,
} from "../../../../services/points/points.service";
import { useUpdateVisitMutation } from "../../../../services/visits/visits.service";
import {
  addAttestationOnStudentAction,
  addPointAction,
  deletePointAction,
  updateAttestationOnStudentAction,
  updatePointAction,
  updateVisitAction,
} from "../../../../store/slices/journal/journal.slice";
import { rules } from "../../../../utils/rules";
import AddItemButton from "../../../simple/AddItemButton/AddItemButton";
import DeleteButton from "../../../simple/DeleteButton/DeleteButton";
import OkButton from "../../../simple/OkButton/OkButton";
import { EditableJournalContext } from "../JournalEditableRow/JournalEditableRow";
import { JournalEditableCellProps } from "./JournalEditableCell.interface";

const { Option } = Select;

const JournalEditableCell: React.FC<JournalEditableCellProps> = ({
  isEditing,
  dataIndex,
  studentId,
  studentSubgroupId,
  lessonId,
  lessonSubgroupId,
  journalId,
  isAbsent,
  pointId,
  annotationId,
  attestationId,
  lessonConducted,
  numberOfPoints,
  credited,
  attestationGrade,
  attestationPoints,
  children,
  ...restProps
}) => {
  const dispatch = useAppDispatch();

  console.log("CELL RENDER");

  const [editing, setEditing] = useState(false);
  const form = useContext(EditableJournalContext)!;

  const [updateVisitAPI] = useUpdateVisitMutation();

  const [createPointAPI] = useCreatePointMutation();
  const [updatePointAPI] = useUpdatePointMutation();
  const [deletePointAPI] = useDeletePointMutation();

  const [createAttestationOnStudentAPI] =
    useCreateAttestationOnStudentMutation();
  const [updateAttestationOnStudentAPI] =
    useUpdateAttestationOnStudentMutation();

  let childNode = children;

  if (lessonId) {
    const handleAbsentChange = (value: boolean) => {
      updateVisitAPI({
        isAbsent: value,
        journalId,
        lessonId,
        studentId,
      })
        .unwrap()
        .then((payload) => {
          dispatch(updateVisitAction(payload));
        })
        .catch(() => message.error("Произошла ошибка при изменении посещения"));
    };

    if (isEditing) {
      if (lessonSubgroupId) {
        childNode = studentSubgroupId === lessonSubgroupId && (
          <Checkbox
            checked={isAbsent}
            onChange={(e: CheckboxChangeEvent) =>
              handleAbsentChange(e.target.checked)
            }
          />
        );
      } else {
        childNode = (
          <Checkbox
            checked={isAbsent}
            onChange={(e: CheckboxChangeEvent) =>
              handleAbsentChange(e.target.checked)
            }
          />
        );
      }
    } else {
      childNode = isAbsent && "H";
    }
  }

  if (annotationId) {
    const handleAddPoint = () => {
      createPointAPI({ annotationId, journalId, lessonId, studentId })
        .unwrap()
        .then((payload) => dispatch(addPointAction(payload)))
        .catch(() => message.error("Произошла ошибка при создании баллов"));
    };

    const handleUpdatePoint = async () => {
      try {
        const values = await form.validateFields();
        const newValue = +values.numberOfPoints;

        toggleEdit();
        if (newValue === numberOfPoints) {
          return;
        }

        const body: IUpdatePointArgs = {
          annotationId,
          journalId,
          lessonId,
          pointId,
          studentId,
          numberOfPoints: newValue,
        };

        updatePointAPI(body)
          .unwrap()
          .then((payload) => dispatch(updatePointAction(payload)))
          .catch(() => message.error("Произошла ошибка при обновлении баллов"));
      } catch (errInfo) {}
    };

    const handleDeletePoint = () => {
      deletePointAPI({
        annotationId,
        journalId,
        lessonId,
        pointId,
        studentId,
      })
        .unwrap()
        .then((payload) => dispatch(deletePointAction(payload)))
        .catch(() => message.error("Произошла ошибка при удалении баллов"));
    };

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ numberOfPoints });
    };

    if (isEditing) {
      if (pointId) {
        childNode = editing ? (
          <Row justify="space-between" align="middle">
            <Form.Item
              name="numberOfPoints"
              rules={[
                rules.pattern(
                  /^(([0-1]?[0-9]?[0-9])|([2][0-4][0-9])|(25[0-5]))$/,
                  "Введите число от 0 до 255 или оставьте поле пустым"
                ),
              ]}
              style={{ margin: 0, width: "80%" }}
            >
              <Input
                autoFocus
                size="small"
                onPressEnter={handleUpdatePoint}
                onBlur={handleUpdatePoint}
                maxLength={3}
              />
            </Form.Item>
            <OkButton onClick={handleUpdatePoint} />
          </Row>
        ) : (
          <Row justify="space-between">
            <div
              className="editable-cell-value-wrap"
              style={{ paddingRight: 24, width: "80%", textAlign: "left" }}
              onClick={toggleEdit}
            >
              {numberOfPoints ? numberOfPoints : "-"}
            </div>

            <DeleteButton onConfirm={handleDeletePoint} />
          </Row>
        );
      } else {
        if (lessonSubgroupId) {
          childNode = studentSubgroupId === lessonSubgroupId && (
            <AddItemButton onClick={() => handleAddPoint()} />
          );
        } else {
          childNode = <AddItemButton onClick={() => handleAddPoint()} />;
        }
      }
    } else {
      childNode = numberOfPoints;
    }
  }

  if (attestationId) {
    const toggleEdit = (field?: string) => {
      setEditing(!editing);
      switch (field) {
        case "points":
          form.setFieldsValue({ points: attestationPoints });
          break;

        case "grade":
          form.setFieldsValue({ grade: attestationGrade });
          break;
      }
    };

    const handleAddAttestationOnStudent = () => {
      createAttestationOnStudentAPI({ attestationId, journalId, studentId })
        .unwrap()
        .then((payload) => dispatch(addAttestationOnStudentAction(payload)))
        .catch(() =>
          message.error("Произошла ошибка при добавлении аттестации")
        );
    };

    const handleUpdateAttestationOnStudent = async (field: string) => {
      try {
        const values = await form.validateFields();
        const newValue = +values[field];
        const oldValue =
          field === "points" ? attestationPoints : attestationGrade;

        toggleEdit();
        if (newValue === oldValue) {
          return;
        }

        let body: IUpdateAttestationOnStudentArgs = {
          attestationId,
          journalId,
          studentId,
        };

        switch (field) {
          case "points":
            body = { ...body, points: newValue };
            break;

          case "grade":
            body = { ...body, credited: true, grade: newValue };
            break;
        }

        updateAttestationOnStudentAPI(body)
          .unwrap()
          .then((payload) =>
            dispatch(updateAttestationOnStudentAction(payload))
          )
          .catch(() =>
            message.error("Произошла ошибка при обновлении аттестации")
          );
      } catch (errInfo) {}
    };

    const handleChangeCredited = (credited: boolean) => {
      updateAttestationOnStudentAPI({
        attestationId,
        journalId,
        studentId,
        credited,
      })
        .unwrap()
        .then((payload) => dispatch(updateAttestationOnStudentAction(payload)))
        .catch(() =>
          message.error("Произошла ошибка при обновлении аттестации")
        );
    };

    const creditedDefined = credited !== undefined;

    if (isEditing) {
      if (creditedDefined) {
        switch (dataIndex) {
          case `${attestationId} attestationCompleted`:
            childNode = (
              <Checkbox
                checked={credited}
                onChange={(e: CheckboxChangeEvent) =>
                  handleChangeCredited(e.target.checked)
                }
              />
            );
            break;

          case `${attestationId} attestationPoints`:
            childNode = editing ? (
              <Row justify="space-between" align="middle">
                <Form.Item
                  name="points"
                  rules={[
                    rules.pattern(
                      /^(([0-1]?[0-9]?[0-9])|([2][0-4][0-9])|(25[0-5]))$/,
                      "Введите число от 0 до 255 или оставьте поле пустым"
                    ),
                  ]}
                  style={{ margin: 0, width: "80%" }}
                >
                  <Input
                    autoFocus
                    size="small"
                    onPressEnter={() =>
                      handleUpdateAttestationOnStudent("points")
                    }
                    onBlur={() => handleUpdateAttestationOnStudent("points")}
                    maxLength={3}
                  />
                </Form.Item>
                <OkButton
                  onClick={() => handleUpdateAttestationOnStudent("points")}
                />
              </Row>
            ) : (
              <Row justify="space-between">
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24, width: "80%", textAlign: "left" }}
                  onClick={() => toggleEdit("points")}
                >
                  {attestationPoints ? attestationPoints : undefined}
                </div>
              </Row>
            );
            break;

          case `${attestationId} attestationGrade`:
            childNode = editing ? (
              <Row justify="space-between" align="middle">
                <Form.Item
                  name="grade"
                  rules={[
                    rules.pattern(
                      /^(([0-1]?[0-9]?[0-9])|([2][0-4][0-9])|(25[0-5]))$/,
                      "Введите число от 0 до 255 или оставьте поле пустым"
                    ),
                  ]}
                  style={{ margin: 0, width: "80%" }}
                >
                  <Select
                    size="small"
                    onBlur={() => handleUpdateAttestationOnStudent("grade")}
                  >
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                  </Select>
                </Form.Item>
                <OkButton
                  onClick={() => handleUpdateAttestationOnStudent("grade")}
                />
              </Row>
            ) : (
              <Row justify="space-between">
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24, width: "80%", textAlign: "left" }}
                  onClick={() => toggleEdit("grade")}
                >
                  {attestationGrade ? attestationGrade : undefined}
                </div>
              </Row>
            );
            break;
        }
      } else {
        childNode = (
          <AddItemButton
            tooltipText="Добавить"
            onClick={() => handleAddAttestationOnStudent()}
          />
        );
      }
    } else {
      switch (dataIndex) {
        case `${attestationId} attestationCompleted`:
          childNode = credited ? "Да" : "Нет";
          break;

        case `${attestationId} attestationPoints`:
          childNode = attestationPoints ? attestationPoints : undefined;
          break;

        case `${attestationId} attestationGrade`:
          childNode = attestationGrade ? attestationGrade : undefined;
          break;
      }
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

export default memo(JournalEditableCell);

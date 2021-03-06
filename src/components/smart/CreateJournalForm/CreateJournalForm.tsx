import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Popover,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { FC, useEffect, useState } from "react";
import { IAttestationTable } from "./CreateJournalForm.interface";
import moment from "moment";
import { Rule } from "antd/lib/form";
import { useNavigate } from "react-router-dom";
import { RouteName } from "../../../constants/routes";
import { useAppDispatch } from "../../../hooks/redux";
import { useGetControlsQuery } from "../../../services/control/control.service";
import { useGetDisciplinesQuery } from "../../../services/disciplines/disciplines.service";
import { useGetGroupsQuery } from "../../../services/groups/groups.service";
import {
  useCreateJournalMutation,
  journalsAPI,
  useLazyGetAllJournalsListQuery,
} from "../../../services/journals/journals.service";
import { useGetWorkTypesQuery } from "../../../services/work-types/work-types.service";
import { rules } from "../../../utils/rules";
import AddItemButton from "../../simple/AddItemButton/AddItemButton";
import DeleteButton from "../../simple/DeleteButton/DeleteButton";
import EditButton from "../../simple/EditButton/EditButton";
import LessonTopicTable from "../LessonTopicTable/LessonTopicTable";
import {
  ILessonTopicTable,
  EditableLessonTopicCellProps,
} from "../LessonTopicTable/LessonTopicTable.interface";

const { Option } = Select;

const CreateJournalForm: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: groupsData = [], isLoading: isGroupsLoading } =
    useGetGroupsQuery();
  const { data: disciplinesData, isLoading: isDisciplinesLoading } =
    useGetDisciplinesQuery();
  const { data: controlsData, isLoading: isControlsLoading } =
    useGetControlsQuery();
  const { data: workTypesData, isLoading: isWorkTypesLoading } =
    useGetWorkTypesQuery();

  const [createJournalAPI, { isLoading: isCreateJournalLoading }] =
    useCreateJournalMutation();

  const [attestationsData, setAttestationsData] = useState<IAttestationTable[]>(
    []
  );
  const [lectureTopicsData, setLectureTopicsData] = useState<
    ILessonTopicTable[]
  >([]);
  const [practiceTopicsData, setPracticeTopicsData] = useState<
    ILessonTopicTable[]
  >([]);
  const [laboratoryTopicsData, setLaboratoryTopicsData] = useState<
    ILessonTopicTable[]
  >([]);
  const [editingKey, setEditingKey] = useState<number>(0);
  // const [journalsListData, setJournalsListData] = useState<IJournalList[]>();
  const [getAllJournalsAPI, allJournalsData] = useLazyGetAllJournalsListQuery();
  const [isFormDataFetching, setIsFormDataFetching] = useState<boolean>(false);

  const [mainForm] = useForm();
  const [attestationForm] = useForm();

  useEffect(() => {
    mainForm.setFieldsValue({
      lectureHours: 0,
      practiceHours: 0,
      laboratoryHours: 0,
    });
  }, []);

  const handleAddAttestation = async () => {
    const key = attestationsData.length + 1;
    const record = {
      key,
      workTypeId:
        workTypesData && workTypesData.length > 0 ? workTypesData[0].id : 0,
      workType:
        workTypesData && workTypesData.length > 0 ? workTypesData[0].name : "",
      workTopic: undefined,
      maximumPoints: undefined,
    };

    setAttestationsData([...attestationsData, record]);
    attestationForm.setFieldsValue({
      ...record,
    });
    setEditingKey(key);
  };

  const handleDeleteAttestation = (record: IAttestationTable) => {
    setAttestationsData([
      ...attestationsData
        .filter((attestation) => attestation.key !== record.key)
        .map((attestation, i) => ({
          ...attestation,
          key: i + 1,
        })),
    ]);
  };

  const handleEditAttestation = (record: IAttestationTable) => {
    attestationForm.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleSaveEditedAttestation = async (key: React.Key) => {
    try {
      const row = (await attestationForm.validateFields()) as IAttestationTable;
      const newData = [...attestationsData];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        item.workType =
          workTypesData?.find((workType) => workType.id === row.workTypeId)
            ?.name || "";
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setAttestationsData(newData);
        setEditingKey(0);
      } else {
        newData.push(row);
        setAttestationsData(newData);
        setEditingKey(0);
      }
    } catch {}
  };

  const handleCancelEditingAttestation = () => {
    setEditingKey(0);
  };

  const handleDisciplineChange = async (value: number) => {
    setIsFormDataFetching(true);
    // setJournalsListData(
    //   (
    //     await dispatch(
    //       journalsAPI.endpoints.getAllJournalsList.initiate({
    //         disciplineId: value,
    //       })
    //     )
    //   ).data
    // );
    getAllJournalsAPI({ disciplineId: value });
    setIsFormDataFetching(false);
  };

  const handleJournalUmkChange = async (value: string) => {
    const journalId = +value;
    setIsFormDataFetching(true);
    const journalUmkInfo = (
      await dispatch(
        journalsAPI.endpoints.getJournalUmkInfo.initiate(journalId)
      )
    ).data;
    setIsFormDataFetching(false);
    mainForm.setFieldsValue({ ...journalUmkInfo });

    if (journalUmkInfo?.attestations) {
      setAttestationsData(
        journalUmkInfo.attestations.map((attestation, i) => ({
          key: i + 1,
          workTypeId: attestation.workType.id,
          workType: attestation.workType.name,
          maximumPoints: attestation.maximumPoints,
          workTopic: attestation.workTopic,
        }))
      );
    }

    if (journalUmkInfo?.lectureTopics) {
      setLectureTopicsData(
        journalUmkInfo?.lectureTopics.map((lectureTopic, i) => ({
          key: i + 1,
          ...lectureTopic,
        }))
      );
    }

    if (journalUmkInfo?.practiceTopics) {
      setPracticeTopicsData(
        journalUmkInfo?.practiceTopics.map((practiceTopic, i) => ({
          key: i + 1,
          ...practiceTopic,
        }))
      );
    }

    if (journalUmkInfo?.laboratoryTopics) {
      setLaboratoryTopicsData(
        journalUmkInfo?.laboratoryTopics.map((laboratoryTopic, i) => ({
          key: i + 1,
          ...laboratoryTopic,
        }))
      );
    }
  };

  const onFinish = async (values: any) => {
    const group = groupsData.find((group) => group.id === values.groupId);
    const semesterName = values.semester;
    const currentDate = moment();
    const dateFormat = "DD.MM.YYYY";
    const startDate = moment(`01.09.${group?.startYear}`, dateFormat);
    const selectedDate =
      semesterName === "??????????????"
        ? moment(`01.09.${currentDate.year()}`, dateFormat)
        : moment(`01.01.${currentDate.year()}`, dateFormat);
    const semester =
      Math.ceil(selectedDate.diff(startDate, "quarters") / 2) + 1;

    const body = {
      ...values,
      semester,
      attestations: attestationsData.map((attestation) => ({
        workTypeId: attestation.workTypeId,
        workTopic: attestation.workTopic,
        maximumPoints: attestation.maximumPoints,
      })),
      lectureTopics: lectureTopicsData.map((topic) => topic.name),
      practiceTopics: practiceTopicsData.map((topic) => topic.name),
      laboratoryTopics: laboratoryTopicsData.map((topic) => topic.name),
    };

    createJournalAPI(body)
      .unwrap()
      .then(() => {
        navigate(RouteName.Journals, { replace: true });
      })
      .catch((err) => {
        message.error("?????????????????? ???????????? ?????? ???????????????? ??????????????");
        console.error(err.data);
      });
  };

  const isEditing = (record: any) => record.key === editingKey;

  const attestationColumns = [
    {
      title: "???",
      isEditable: false,
      dataIndex: "key",
      width: "5%",
      align: "center",
    },
    {
      title: "?????? ????????????",
      isEditable: true,
      dataIndex: "workType",
      align: "center",
      width: "25%",
    },
    {
      title: "???????? ????????????",
      isEditable: true,
      dataIndex: "workTopic",
      align: "center",
      render: (text: string) => (
        <div style={{ wordBreak: "break-word", wordWrap: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "???????????????????????? ???????????????????? ????????????",
      isEditable: true,
      dataIndex: "maximumPoints",
      align: "center",
      width: "20%",
    },
    {
      title: "????????????????",
      align: "center",
      width: "5%",
      dataIndex: "action",
      render: (_: any, record: IAttestationTable) => {
        const isEditable = isEditing(record);
        const isSomeRowEditing = editingKey !== 0;
        return attestationsData.length > 0 ? (
          <Space>
            {isEditable ? (
              <>
                <Popover content="??????????????????">
                  <CheckOutlined
                    style={{ color: "green", fontSize: 20 }}
                    onClick={() => handleSaveEditedAttestation(record.key)}
                  />
                </Popover>
                <Popover content="????????????????">
                  <CloseOutlined
                    style={{ color: "red", fontSize: 20 }}
                    onClick={handleCancelEditingAttestation}
                  />
                </Popover>
              </>
            ) : (
              <>
                <EditButton
                  tooltipText="?????????????????????????? ????????????????????"
                  disabled={isSomeRowEditing}
                  onClick={() => handleEditAttestation(record)}
                />

                <DeleteButton
                  tooltipText="?????????????? ????????????????????"
                  onConfirm={() => handleDeleteAttestation(record)}
                  disabled={isSomeRowEditing}
                />
              </>
            )}
          </Space>
        ) : null;
      },
    },
  ];

  const mergedAttestationColumns = attestationColumns.map((col: any) => {
    if (!col.isEditable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: IAttestationTable) => ({
        record,
        inputType: col.dataIndex === "maximumPoints" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        isEditing: isEditing(record),
      }),
    };
  });

  const EditableAttestationCell: React.FC<EditableLessonTopicCellProps> = ({
    isEditing,
    dataIndex,
    record,
    children,
    ...restProps
  }) => {
    let inputNode;
    let inputRules: Rule[] = [];
    let formItemName = dataIndex;

    switch (formItemName) {
      case "workType":
        inputNode = (
          <Select loading={isWorkTypesLoading}>
            {workTypesData?.map((workType) => (
              <Option key={workType.id} value={workType.id}>
                {workType.name}
              </Option>
            ))}
          </Select>
        );
        formItemName = "workTypeId";
        break;

      case "workTopic":
        inputNode = <Input maxLength={250} />;
        break;

      case "maximumPoints":
        inputNode = <Input maxLength={2} />;
        inputRules.push(
          rules.pattern(
            /^\d{1,2}$|^$/,
            "?????????????? ?????????? ?????? ???????????????? ???????? ????????????"
          )
        );
        break;
    }

    let childNode = children;

    if (isEditing) {
      childNode = (
        <Form.Item name={formItemName} style={{ margin: 0 }} rules={inputRules}>
          {inputNode}
        </Form.Item>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <>
      <Row justify="center" style={{ marginBottom: 5 }}>
        <h2>
          <Space>
            <strong>???????????????? ??????????????</strong>
            {isFormDataFetching && <Spin size="small" />}
          </Space>
        </h2>
      </Row>
      <Form
        form={mainForm}
        name="journal"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row justify="center">
          <Col xs={{ span: 24 }} lg={{ span: 16 }}>
            <Form.Item
              name="groupId"
              rules={[rules.required("???????????????????????? ????????")]}
            >
              <Select
                showSearch
                placeholder="???????????????? ????????????"
                loading={isGroupsLoading}
                optionFilterProp="label"
              >
                {groupsData.map((group) => (
                  <Option key={group.id} value={group.id} label={group.name}>
                    {group.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="disciplineId"
              rules={[rules.required("???????????????????????? ????????")]}
            >
              <Select
                showSearch
                placeholder="???????????????? ????????????????????"
                loading={isDisciplinesLoading}
                onChange={(value) => handleDisciplineChange(value)}
                optionFilterProp="label"
              >
                {disciplinesData?.map((discipline) => (
                  <Option
                    key={discipline.id}
                    value={discipline.id}
                    label={discipline.name}
                  >
                    {discipline.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {allJournalsData.currentData &&
              allJournalsData.currentData?.items.length > 0 && (
                <Form.Item>
                  <Select
                    showSearch
                    placeholder="?????????????? ???????????? ???? ?????????????????????????? ??????????????"
                    loading={isDisciplinesLoading}
                    onSelect={(value: string) => handleJournalUmkChange(value)}
                    optionFilterProp="label"
                  >
                    {allJournalsData.currentData?.items.map((journal) => {
                      const name = `${journal.user.lastName} ${journal.user.firstName[0]}. ${journal.user.middleName[0]}`;
                      const value = `${name} - ${journal.group} - ??????????????: ${journal.semester}`;
                      return (
                        <Option
                          key={journal.id}
                          value={journal.id}
                          label={`${value}`}
                        >
                          {value}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )}

            <Form.Item
              name="controlId"
              rules={[rules.required("???????????????????????? ????????")]}
            >
              <Select
                loading={isControlsLoading}
                placeholder="???????????????? ????????????????"
              >
                {controlsData?.map((control) => (
                  <Option key={control.id} value={control.id}>
                    {control.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="semester"
              rules={[rules.required("???????????????????????? ????????")]}
            >
              <Select placeholder="???????????????? ??????????????">
                <Option value="??????????????">??????????????</Option>
                <Option value="????????????????">????????????????</Option>
              </Select>
            </Form.Item>

            <Row justify="space-between" align="middle" gutter={[0, 24]}>
              <Col
                xs={{ span: 24 }}
                md={{ span: 11 }}
                style={{
                  border: "1px solid black",
                  paddingTop: 24,
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
              >
                <Form.Item
                  shouldUpdate
                  name="lectureHours"
                  label="?????????? ????????????"
                  rules={[
                    rules.required("???????????????????????? ????????"),
                    rules.pattern(
                      /^\d{1,3}$/,
                      "?????????????? ?????????????????????????? ?????????? ?????? 0"
                    ),
                    {
                      validator: (_, value: number) => {
                        const availableHours = +value;
                        if (isNaN(availableHours) || availableHours < 0) {
                          return Promise.reject();
                        }

                        const hours = lectureTopicsData.length * 2;
                        if (availableHours >= hours) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            `???? ?????????????? ???????????????????? ?????????? (${
                              hours - availableHours
                            }). ?????????????????? ???????? ??????????????.`
                          )
                        );
                      },
                    },
                  ]}
                >
                  <Input maxLength={3} />
                </Form.Item>

                <Form.Item
                  shouldUpdate
                  name="practiceHours"
                  label="?????????? ??????????????"
                  rules={[
                    rules.required("???????????????????????? ????????"),
                    rules.pattern(
                      /^\d{1,3}$/,
                      "?????????????? ?????????????????????????? ?????????? ?????? 0"
                    ),
                    {
                      validator: (_, value: number) => {
                        const availableHours = +value;
                        if (isNaN(availableHours) || availableHours < 0) {
                          return Promise.reject();
                        }

                        const hours = practiceTopicsData.length * 2;
                        if (availableHours >= hours) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            `???? ?????????????? ???????????????????? ?????????? (${
                              hours - availableHours
                            }). ?????????????????? ???????? ??????????????.`
                          )
                        );
                      },
                    },
                  ]}
                >
                  <Input maxLength={3} />
                </Form.Item>

                <Form.Item
                  shouldUpdate
                  name="laboratoryHours"
                  label="?????????? ????????????????????????"
                  rules={[
                    rules.required("???????????????????????? ????????"),
                    rules.pattern(
                      /^\d{1,3}$/,
                      "?????????????? ?????????????????????????? ?????????? ?????? 0"
                    ),
                    {
                      validator: (_, value: number) => {
                        const availableHours = +value;
                        if (isNaN(availableHours) || availableHours < 0) {
                          return Promise.reject();
                        }

                        const hours = laboratoryTopicsData.length * 2;
                        if (availableHours >= hours) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            `???? ?????????????? ???????????????????? ?????????? (${
                              hours - availableHours
                            }). ?????????????????? ???????? ??????????????.`
                          )
                        );
                      },
                    },
                  ]}
                >
                  <Input maxLength={3} />
                </Form.Item>
              </Col>

              <Col
                xs={{ span: 24 }}
                md={{ span: 11 }}
                style={{
                  border: "1px solid black",
                  paddingTop: 24,
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
              >
                <Form.Item
                  name="pointsForThree"
                  label="???????????? ???? 3"
                  rules={[
                    rules.pattern(/^\d{1,3}$/, "?????????????? ?????????????????????????? ??????????"),
                  ]}
                >
                  <Input maxLength={3} />
                </Form.Item>

                <Form.Item
                  name="pointsForFour"
                  label="???????????? ???? 4"
                  rules={[
                    rules.pattern(/^\d{1,3}$/, "?????????????? ?????????????????????????? ??????????"),
                  ]}
                >
                  <Input maxLength={3} />
                </Form.Item>

                <Form.Item
                  name="pointsForFive"
                  label="???????????? ???? 5"
                  rules={[
                    rules.pattern(/^\d{1,3}$/, "?????????????? ?????????????????????????? ??????????"),
                  ]}
                >
                  <Input maxLength={3} />
                </Form.Item>

                <Form.Item
                  name="maximumPoints"
                  label="???????????????????????? ????????"
                  rules={[
                    rules.pattern(/^\d{1,3}$/, "?????????????? ?????????????????????????? ??????????"),
                  ]}
                >
                  <Input maxLength={3} />
                </Form.Item>
              </Col>
            </Row>

            <Divider>?????????????????????????? ????????????????????</Divider>
            <Form.Item style={{ marginTop: 24 }}>
              {attestationsData.length > 0 ? (
                <Form form={attestationForm} component={false}>
                  <Table<IAttestationTable>
                    bordered
                    columns={mergedAttestationColumns}
                    components={{
                      body: {
                        cell: EditableAttestationCell,
                      },
                    }}
                    pagination={false}
                    dataSource={attestationsData}
                    size="small"
                    footer={() => (
                      <Row justify="center">
                        <AddItemButton
                          onClick={handleAddAttestation}
                          disabled={editingKey !== 0}
                        />
                      </Row>
                    )}
                  ></Table>
                </Form>
              ) : (
                <Row justify="center">
                  <Button onClick={handleAddAttestation}>
                    ???????????????? ?????????????????????????? ????????????????????
                  </Button>
                </Row>
              )}
            </Form.Item>

            <Divider>???????? ????????????</Divider>
            <Form.Item style={{ marginTop: 24 }} shouldUpdate>
              {() => (
                <LessonTopicTable
                  lessonHours={+mainForm.getFieldValue("lectureHours")}
                  setLessonTopics={setLectureTopicsData}
                  lessonTopics={lectureTopicsData}
                />
              )}
            </Form.Item>

            <Divider>???????? ??????????????</Divider>
            <Form.Item style={{ marginTop: 24 }} shouldUpdate>
              {() => (
                <LessonTopicTable
                  lessonHours={+mainForm.getFieldValue("practiceHours")}
                  setLessonTopics={setPracticeTopicsData}
                  lessonTopics={practiceTopicsData}
                />
              )}
            </Form.Item>

            <Divider>???????? ????????????????????????</Divider>
            <Form.Item style={{ marginTop: 24 }} shouldUpdate>
              {() => (
                <LessonTopicTable
                  lessonHours={+mainForm.getFieldValue("laboratoryHours")}
                  setLessonTopics={setLaboratoryTopicsData}
                  lessonTopics={laboratoryTopicsData}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Row justify="center">
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreateJournalLoading}
            >
              ?????????????? ????????????
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateJournalForm;

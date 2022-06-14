import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  InputRef,
  message,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { FC, memo, useRef } from "react";
import { useDispatch } from "react-redux";
import { IUpdateSubgroupsStudentsArgs } from "../../../services/subgroups/subgroups.interface";
import {
  useCreateSubgroupMutation,
  useDeleteSubgroupMutation,
  useUpdateManySubgroupStudentMutation,
  useUpdateSubgroupStudentMutation,
} from "../../../services/subgroups/subgroups.service";
import {
  addSubgroupAction,
  deleteSubgroupAction,
  updateSubgroupStudentAction,
  updateManySubgroupsStudentsAction,
} from "../../../store/slices/journal/journal.slice";
import AppPopConfirm from "../../simple/AppPopConfirm/AppPopConfirm";
import PopCodeConfirm from "../PopCodeConfirm/PopCodeConfirm";
import {
  EditSubgroupsProps,
  IEditSubgroupsTable,
} from "./EditSubgroups.interface";

const { Option } = Select;

const EditSubgroups: FC<EditSubgroupsProps> = ({
  groupId,
  journalId,
  students,
  subgroups,
}) => {
  const dispatch = useDispatch();

  const [createSubgroupAPI, { isLoading: isCreateSubgroupLoading }] =
    useCreateSubgroupMutation();
  const [
    updateSubgroupStudentAPI,
    { isLoading: isUpdateSubgroupStudentLoading },
  ] = useUpdateSubgroupStudentMutation();
  const [deleteSubgroupAPI, { isLoading: isDeleteSubgroupLoading }] =
    useDeleteSubgroupMutation();
  const [
    updateManySubgroupStudentAPI,
    { isLoading: isUpdateManySubgroupStudentLoading },
  ] = useUpdateManySubgroupStudentMutation();

  const isJournalSubgroupsStudentsLoading =
    isUpdateSubgroupStudentLoading || isUpdateManySubgroupStudentLoading;

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (confirm: () => void) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const handleCreateNewSubgroup = () => {
    const subgroup = subgroups.length + 1;
    createSubgroupAPI({ journalId, groupId, subgroup })
      .unwrap()
      .then((payload) => dispatch(addSubgroupAction(payload)))
      .catch(() => message.error("Произошла ошибка при создании подгруппы"));
  };

  const handleChangeSubgroup = (
    record: IEditSubgroupsTable,
    subgroupId: number
  ) => {
    if (record.subgroup?.id === subgroupId) {
      return;
    }

    updateSubgroupStudentAPI({
      journalId,
      studentId: record.key,
      subgroupId: record.subgroup?.id,
      newSubgroupId: subgroupId,
    })
      .unwrap()
      .then((payload) => dispatch(updateSubgroupStudentAction(payload)))
      .catch(() =>
        message.error("Произошла ошибка при обновлении подгруппы студента")
      );
  };

  const handleDeleteLastSubgroup = () => {
    const subgroup = subgroups[subgroups.length - 1];

    const student = students.find(
      (student) => student.subgroup.id === subgroup.id
    );

    if (student) {
      message.error(
        `В подгруппе ${subgroup.subgroupNumber.value} не должно быть студентов`
      );
      return;
    }

    deleteSubgroupAPI({
      journalId,
      subgroupId: subgroup.id,
    })
      .unwrap()
      .then((payload) => {
        dispatch(deleteSubgroupAction(payload));
      })
      .catch(() => {
        message.error("Произошла ошибка при удалении подгруппы");
      });
  };

  const handleDivideEqually = () => {
    const temp: IUpdateSubgroupsStudentsArgs = { items: [] };
    const middleI = Math.floor(students.length / 2);
    const firstSubgroupId = subgroups.find(
      (subgroup) => subgroup.subgroupNumber.value === 1
    )?.id;
    const secondSubgroupId = subgroups.find(
      (subgroup) => subgroup.subgroupNumber.value === 2
    )?.id;

    if (firstSubgroupId && secondSubgroupId) {
      for (let i = 0; i < middleI; i++) {
        temp.items.push({
          journalId,
          studentId: students[i].id,
          subgroupId: students[i].subgroup?.id,
          newSubgroupId: firstSubgroupId,
        });
      }

      for (let i = middleI; i < students.length; i++) {
        temp.items.push({
          journalId,
          studentId: students[i].id,
          subgroupId: students[i].subgroup?.id,
          newSubgroupId: secondSubgroupId,
        });
      }

      updateManySubgroupStudentAPI(temp)
        .unwrap()
        .then((payload) => dispatch(updateManySubgroupsStudentsAction(payload)))
        .catch(() =>
          message.error("Произошла ошибка при обновлении подгрупп студентов")
        );
    } else {
      message.error("Произошла ошибка при обновлении подгрупп");
    }
  };

  const dataSource = students.map((student) => ({
    key: student.id,
    studentName: `${student.lastName} ${student.firstName} ${student.middleName}`,
    subgroup: student.subgroup,
  }));

  const columns: ColumnsType<IEditSubgroupsTable> = [
    {
      title: "ФИО студента",
      dataIndex: "studentName",
      align: "center",
      width: "70%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Найти по ФИО`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(confirm)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Найти
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Сбросить
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
              }}
            >
              Фильтр
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record["studentName"]
          .toString()
          .toLowerCase()
          .startsWith(value as string),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text: string, record: IEditSubgroupsTable) => {
        const subgroup = record.subgroup;
        return (
          <div
            style={{
              textAlign: "left",
              color: subgroup ? "black" : "red",
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "№ подгруппы",
      dataIndex: "subgroup",
      align: "center",
      filters: [
        ...subgroups.map((subgroup) => ({
          text: subgroup.subgroupNumber.value,
          value: subgroup.subgroupNumber.value,
        })),
      ],
      onFilter: (value, record) =>
        record.subgroup?.subgroupNumber.value === value,
      render: (text: string, record: IEditSubgroupsTable, index: number) => (
        <Select
          size="small"
          style={{ width: "100%" }}
          value={record.subgroup ? record.subgroup.subgroupNumber.value : null}
          defaultValue={
            record.subgroup ? record.subgroup.subgroupNumber.value : null
          }
          onChange={(value: number) => {
            handleChangeSubgroup(record, +value);
          }}
          loading={isJournalSubgroupsStudentsLoading}
          disabled={isJournalSubgroupsStudentsLoading}
        >
          {subgroups.map((subgroup) => (
            <Option key={subgroup.id}>{subgroup.subgroupNumber.value}</Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Row gutter={[0, 24]}>
      {subgroups.length > 1 && (
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          sticky
          scroll={{ y: window.screen.availHeight - 500 }}
        ></Table>
      )}
      <Row
        justify="space-between"
        align="middle"
        gutter={[0, 12]}
        style={{ width: "100%" }}
      >
        <span>Количество подгрупп в группе: {subgroups.length}</span>
        <Button
          onClick={handleCreateNewSubgroup}
          loading={isCreateSubgroupLoading}
        >
          Создать подгруппу № {subgroups.length + 1}
        </Button>
        {subgroups.length > 1 && (
          <>
            <AppPopConfirm onConfirm={handleDivideEqually}>
              <Button>Разделить поровну на 2 подгруппы</Button>
            </AppPopConfirm>
            <PopCodeConfirm
              code={subgroups[
                subgroups.length - 1
              ].subgroupNumber.value.toString()}
              onOk={handleDeleteLastSubgroup}
              text="Все занятия и успеваемость на них будут удалены для данной подгруппы!"
            >
              <Button danger loading={isDeleteSubgroupLoading}>
                Удалить подгруппу {subgroups.length}
              </Button>
            </PopCodeConfirm>
          </>
        )}
      </Row>
    </Row>
  );
};

export default memo(EditSubgroups);

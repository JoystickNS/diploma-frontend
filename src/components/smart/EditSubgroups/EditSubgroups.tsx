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
import { IUpdateJournalSubgroupsStudentsArgs } from "../../../services/journals/journals.interface";
import {
  useCreateJournalSubgroupMutation,
  useDeleteJournalSubgroupMutation,
  useUpdateJournalSubgroupStudentMutation,
  useUpdateManyJournalSubgroupStudentMutation,
} from "../../../services/journals/journals.service";
import {
  addJournalSubgroup,
  deleteJournalSubgroup,
  updateJournalSubgroupStudent,
  updateManyJournalSubgroupsStudents,
} from "../../../store/slices/journal/journal.slice";
import AppPopConfirm from "../../simple/AppPopConfirm/AppPopConfirm";
import PopCodeConfirm from "../PopCodeConfirm/PopCodeConfirm";
import {
  EditSubgroupsProps,
  IEditSubgroupsTable,
} from "./EditSubgroups.interface";

const { Option } = Select;

const EditSubgroups: FC<EditSubgroupsProps> = ({
  group,
  journalId,
  students,
  subgroups,
}) => {
  const dispatch = useDispatch();

  const [
    createJournalSubgroupAPI,
    { isLoading: isCreateJournalSubgroupLoading },
  ] = useCreateJournalSubgroupMutation();
  const [
    updateJournalSubgroupStudentAPI,
    { isLoading: isUpdateJournalSubgroupStudentLoading },
  ] = useUpdateJournalSubgroupStudentMutation();
  const [
    deleteJournalSubgroupAPI,
    { isLoading: isDeleteJournalSubgroupLoading },
  ] = useDeleteJournalSubgroupMutation();
  const [
    updateManyJournalSubgroupStudentAPI,
    { isLoading: isUpdateManyJournalSubgroupStudentLoading },
  ] = useUpdateManyJournalSubgroupStudentMutation();

  const isJournalSubgroupsStudentsLoading =
    isUpdateJournalSubgroupStudentLoading ||
    isUpdateManyJournalSubgroupStudentLoading;

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (confirm: () => void) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const handleCreateNewSubgroup = () => {
    const subgroup = subgroups.length + 1;
    createJournalSubgroupAPI({ journalId, group, subgroup })
      .unwrap()
      .then((payload) => dispatch(addJournalSubgroup(payload)))
      .catch(() => message.error("Произошла ошибка при создании подгруппы"));
  };

  const handleChangeSubgroup = (
    record: IEditSubgroupsTable,
    subgroupId: number
  ) => {
    if (record.subgroup.id === subgroupId) {
      return;
    }

    updateJournalSubgroupStudentAPI({
      journalId,
      studentId: record.key,
      subgroupId: record.subgroup.id,
      newSubgroupId: subgroupId,
    })
      .unwrap()
      .then((payload) => dispatch(updateJournalSubgroupStudent(payload)))
      .catch(() =>
        message.error("Произошла ошибка при обновлении подгруппы студента")
      );
  };

  const handleDeleteLastSubgroup = () => {
    const subgroup = subgroups[subgroups.length - 1];
    deleteJournalSubgroupAPI({
      journalId,
      subgroupId: subgroup.id,
    })
      .unwrap()
      .then((payload) => {
        dispatch(deleteJournalSubgroup(payload.id));
      })
      .catch(() => {
        message.error(
          `В подгруппе ${subgroup.number.value} не должно быть студентов`
        );
      });
  };

  const handleDivideEqually = () => {
    const temp: IUpdateJournalSubgroupsStudentsArgs = { items: [] };
    const middleI = Math.floor(students.length / 2);
    const firstSubgroupId = subgroups.find(
      (subgroup) => subgroup.number.value === 1
    )?.id;
    const secondSubgroupId = subgroups.find(
      (subgroup) => subgroup.number.value === 2
    )?.id;

    if (firstSubgroupId && secondSubgroupId) {
      for (let i = 0; i < middleI; i++) {
        temp.items.push({
          journalId,
          studentId: students[i].id,
          subgroupId: students[i].subgroup.id,
          newSubgroupId: firstSubgroupId,
        });
      }

      for (let i = middleI; i < students.length; i++) {
        temp.items.push({
          journalId,
          studentId: students[i].id,
          subgroupId: students[i].subgroup.id,
          newSubgroupId: secondSubgroupId,
        });
      }

      updateManyJournalSubgroupStudentAPI(temp)
        .unwrap()
        .then((payload) =>
          dispatch(updateManyJournalSubgroupsStudents(payload))
        )
        .catch(() => message.error("Произошла ошибка при обновлении подгрупп"));
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
      render: (text: string) => (
        <div
          style={{
            textAlign: "left",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "№ подгруппы",
      dataIndex: "subgroup",
      align: "center",
      filters: [
        ...subgroups.map((subgroup) => ({
          text: subgroup.number.value,
          value: subgroup.number.value,
        })),
      ],
      onFilter: (value, record) => record.subgroup.number.value === value,
      render: (text: string, record: IEditSubgroupsTable, index: number) => (
        <Select
          size="small"
          style={{ width: "100%" }}
          value={record.subgroup.number.value}
          defaultValue={record.subgroup.number.value}
          onChange={(value: number) => {
            handleChangeSubgroup(record, +value);
          }}
          loading={isJournalSubgroupsStudentsLoading}
          disabled={isJournalSubgroupsStudentsLoading}
        >
          {subgroups.map((subgroup) => (
            <Option key={subgroup.id}>{subgroup.number.value}</Option>
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
          scroll={{ y: window.screen.availHeight - 400 }}
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
          loading={isCreateJournalSubgroupLoading}
          style={{ width: "40%" }}
        >
          Создать подгруппу № {subgroups.length + 1}
        </Button>
        {subgroups.length > 1 && (
          <>
            <AppPopConfirm onConfirm={handleDivideEqually}>
              <Button>Разделить поровну на 2 подгруппы</Button>
            </AppPopConfirm>
            <PopCodeConfirm
              code={subgroups[subgroups.length - 1].number.value.toString()}
              onOk={handleDeleteLastSubgroup}
              text="Вся успеваемость для данной подгруппы будет удалена!"
            >
              <Button
                danger
                loading={isDeleteJournalSubgroupLoading}
                style={{ width: "40%" }}
              >
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

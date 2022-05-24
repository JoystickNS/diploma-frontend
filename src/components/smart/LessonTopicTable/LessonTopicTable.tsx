import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Form,
  message,
  Popover,
  Row,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { FC, memo, useState } from "react";
import AddItemButton from "../../simple/AddItemButton/AddItemButton";
import AppPopConfirm from "../../simple/AppPopConfirm/AppPopConfirm";
import { rules } from "../../../utils/rules";
import {
  EditableLessonTopicCellProps,
  ILessonTopicTable,
  LessonTopicTableProps,
} from "./LessonTopicTable.interface";
import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton";

const LessonTopicTable: FC<LessonTopicTableProps> = ({
  lessonHours,
  lessonTopics,
  setLessonTopics,
  ...props
}) => {
  const [editingKey, setEditingKey] = useState<number>(-1);
  const [form] = useForm();

  const handleAdd = async () => {
    if (lessonHours <= lessonTopics.length * 2) {
      message.error("Не хватает количества часов");
      return;
    }

    const key = lessonTopics.length + 1;
    const record = {
      key,
      name: "",
    };

    setLessonTopics([...lessonTopics, record]);
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(key);
  };

  const handleDelete = (record: ILessonTopicTable) => {
    setLessonTopics([
      ...lessonTopics
        .filter((lessonTopic) => lessonTopic.key !== record.key)
        .map((lesson, i) => ({
          ...lesson,
          key: i + 1,
        })),
    ]);
  };

  const handleEdit = (record: ILessonTopicTable) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleSave = async () => {
    try {
      const row = (await form.validateFields()) as ILessonTopicTable;
      const newData = [...lessonTopics];
      const index = newData.findIndex((item) => editingKey === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setLessonTopics(newData);
        setEditingKey(-1);
      } else {
        newData.push(row);
        setLessonTopics(newData);
        setEditingKey(-1);
      }
    } catch {}
  };

  const handleCancel = () => {
    setEditingKey(-1);
  };

  const handleDeleteAll = () => {
    setLessonTopics([]);
  };

  const isEditing = (record: ILessonTopicTable) => record.key === editingKey;

  const handleAutoCompleteKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSave();
      e.preventDefault();
    }
  };

  const columns = [
    {
      title: "№ занятия",
      isEditable: false,
      dataIndex: "key",
      width: "10%",
      align: "center",
    },
    {
      title: "Тема занятия",
      isEditable: true,
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Действия",
      align: "center",
      width: "10%",
      dataIndex: "action",
      render: (_: any, record: ILessonTopicTable) => {
        const isRecordEditing = isEditing(record);
        const isSomeRecordEditing = editingKey !== -1;

        return lessonTopics.length > 0 ? (
          <Space>
            {isRecordEditing ? (
              <>
                <Popover content="Сохранить">
                  <Button type="link" style={{ padding: 0 }} size="small">
                    <CheckOutlined
                      style={{ color: "green", fontSize: 20 }}
                      onClick={() => handleSave()}
                    />
                  </Button>
                </Popover>
                <Popover content="Отменить">
                  <Button type="link" style={{ padding: 0 }} size="small">
                    <CloseOutlined
                      style={{ color: "red", fontSize: 20 }}
                      onClick={handleCancel}
                    />
                  </Button>
                </Popover>
              </>
            ) : (
              <>
                <EditButton
                  onClick={() => handleEdit(record)}
                  disabled={isSomeRecordEditing}
                />

                <DeleteButton
                  onConfirm={() => handleDelete(record)}
                  disabled={isSomeRecordEditing}
                />
              </>
            )}
          </Space>
        ) : null;
      },
    },
  ];

  const mergedColumns = columns.map((col: any) => {
    if (!col.isEditable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ILessonTopicTable) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        isEditing: isEditing(record),
      }),
    };
  });

  const EditableCell: React.FC<EditableLessonTopicCellProps> = ({
    isEditing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const autoCompleteOptions: { value: string }[] = [];
    lessonTopics.forEach((lessonTopic) => {
      if (
        lessonTopic.name &&
        !autoCompleteOptions.find((option) => option.value === lessonTopic.name)
      ) {
        autoCompleteOptions.push({ value: lessonTopic.name });
      }
    });
    return (
      <td {...restProps}>
        {isEditing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[rules.max(200, "Введите не более 200 символов")]}
          >
            <AutoComplete
              options={autoCompleteOptions}
              filterOption={(inputValue, option) =>
                option!.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              onKeyDown={(e: any) => {
                handleAutoCompleteKeyDown(e);
              }}
            ></AutoComplete>
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return lessonTopics.length > 0 ? (
    <>
      {lessonTopics.length > 1 && (
        <Row justify="end" style={{ marginBottom: 24 }}>
          <AppPopConfirm onConfirm={handleDeleteAll}>
            <Button danger>Удалить все</Button>
          </AppPopConfirm>
        </Row>
      )}

      <Form form={form} component={false}>
        <Table
          bordered
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          pagination={false}
          dataSource={lessonTopics}
          size="small"
          footer={() => (
            <Row justify="center">
              <AddItemButton
                tooltipText="Добавить тему"
                onClick={handleAdd}
                disabled={editingKey !== -1}
              />
            </Row>
          )}
          {...props}
        ></Table>
      </Form>
    </>
  ) : (
    <Row justify="center">
      <Button onClick={handleAdd}>Добавить тему</Button>
    </Row>
  );
};

export default memo(LessonTopicTable);

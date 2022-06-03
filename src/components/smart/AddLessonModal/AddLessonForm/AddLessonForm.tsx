import { AutoComplete, DatePicker, Form, Input, Select } from "antd";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { ALL_SUBGROUPS } from "../../../../constants/general";
import { rules } from "../../../../utils/rules";
import { AddLessonFormProps } from "./AddLessonForm.interface";

interface IAutoCompleteOption {
  value: string;
}

const { Option } = Select;
const { TextArea } = Input;

const AddLessonForm: FC<AddLessonFormProps> = ({
  lessons,
  lessonTypes,
  lessonTopics,
  subgroups,
  updateMode,
  form,
}) => {
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    IAutoCompleteOption[]
  >([]);

  useEffect(() => {
    if (updateMode) {
      const typeId = form.getFieldValue("typeId");
      handleLessonTypeChange(typeId);
    }
  }, []);

  const handleAutoCompleteKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleLessonTypeChange = (value: number) => {
    setAutoCompleteOptions(
      lessonTopics
        .filter((topic) => topic.lessonType.id === value && topic.name !== "")
        .map((topic) => ({
          value: topic.name,
        }))
    );
  };

  const isEditConductedLesson = !!lessons.find(
    (lesson) => lesson.conducted && lesson.id === form.getFieldValue("lessonId")
  );

  return (
    <Form form={form} labelCol={{ span: 6 }}>
      {updateMode && <Form.Item name="lessonId" style={{ display: "none" }} />}
      {subgroups.length > 1 && (
        <Form.Item
          label={"Подгруппа"}
          colon={false}
          name="subgroupIds"
          rules={[rules.required("Обязательное поле")]}
        >
          <Select disabled={isEditConductedLesson}>
            <>
              <Option key={0} value={0}>
                {ALL_SUBGROUPS}
              </Option>
              {subgroups.map((subgroup) => (
                <Option key={subgroup.subgroupNumber.id} value={subgroup.id}>
                  {subgroup.subgroupNumber.value}
                </Option>
              ))}
            </>
          </Select>
        </Form.Item>
      )}

      <Form.Item
        label={"Тип занятия"}
        colon={false}
        name="lessonTypeId"
        rules={[rules.required("Обязательное поле")]}
      >
        <Select
          onChange={handleLessonTypeChange}
          disabled={isEditConductedLesson}
        >
          {lessonTypes.map((lessonType) => (
            <Option key={lessonType.id} value={lessonType.id}>
              {lessonType.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={"Тема занятия"}
        colon={false}
        name="lessonTopic"
        rules={[rules.max(250, "Введите не больше 250 символов")]}
      >
        <AutoComplete
          options={autoCompleteOptions}
          optionFilterProp="label"
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onKeyDown={(e: any) => {
            handleAutoCompleteKeyDown(e);
          }}
        >
          <TextArea rows={3} showCount></TextArea>
        </AutoComplete>
      </Form.Item>

      <Form.Item
        label={"Дата занятия"}
        colon={false}
        name="date"
        rules={[rules.required("Обязательное поле")]}
        initialValue={moment()}
      >
        <DatePicker
          style={{ width: "100%" }}
          format="DD.MM.YYYY"
          disabled={isEditConductedLesson}
        />
      </Form.Item>
    </Form>
  );
};

export default AddLessonForm;

AddLessonForm.defaultProps = {
  updateMode: false,
};

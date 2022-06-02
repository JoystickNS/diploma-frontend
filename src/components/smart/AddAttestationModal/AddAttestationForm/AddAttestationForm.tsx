import { Form, Select, Input } from "antd";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { FC } from "react";
import { rules } from "../../../../utils/rules";
import { AddAttestationFormProps } from "./AddAttestationForm.interface";

const { Option } = Select;

const AddAttestationForm: FC<AddAttestationFormProps> = ({
  updateMode,
  form,
  workTypes,
}) => {
  return (
    <Form form={form}>
      {updateMode && (
        <FormItem name="attestationId" style={{ display: "none" }} />
      )}

      <FormItem
        name="workTypeId"
        label="Тип работы"
        labelCol={{ span: 7 }}
        rules={[rules.required("Обязательное поле")]}
      >
        <Select style={{ width: "100%" }}>
          {workTypes.map((workType) => (
            <Option key={workType.id} value={workType.id}>
              {workType.name}
            </Option>
          ))}
        </Select>
      </FormItem>

      <FormItem name="workTopic" label="Тема работы" labelCol={{ span: 7 }}>
        <TextArea rows={3} maxLength={250} showCount />
      </FormItem>

      <FormItem
        name="maximumPoints"
        label="Максимум баллов"
        labelCol={{ span: 7 }}
        rules={[
          rules.pattern(
            /^\d{1,2}$|^$/,
            "Введите число или оставьте поле пустым"
          ),
        ]}
      >
        <Input maxLength={2} />
      </FormItem>
    </Form>
  );
};

export default AddAttestationForm;

import { Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FC } from "react";
import { AddAnnotationFormProps } from "./AddAnnotationForm.interface";

const AddAnnotationForm: FC<AddAnnotationFormProps> = ({
  updateMode,
  form,
}) => {
  return (
    <Form form={form} labelCol={{ span: 4 }}>
      {updateMode && (
        <Form.Item name="annotationId" style={{ display: "none" }} />
      )}

      {<Form.Item name="lessonId" style={{ display: "none" }} />}

      <Form.Item
        label={"Пояснение"}
        colon={false}
        name="name"
        style={{ marginBottom: 0 }}
      >
        <TextArea rows={2} showCount maxLength={100}></TextArea>
      </Form.Item>
    </Form>
  );
};

export default AddAnnotationForm;

AddAnnotationForm.defaultProps = {
  updateMode: false,
};

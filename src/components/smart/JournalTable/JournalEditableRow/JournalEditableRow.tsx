import { FormInstance, Form } from "antd";
import React from "react";
import { FC } from "react";

export const EditableJournalContext =
  React.createContext<FormInstance<any> | null>(null);

const JournalEditableRow: FC = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableJournalContext.Provider value={form}>
        <tr {...props} />
      </EditableJournalContext.Provider>
    </Form>
  );
};

export default JournalEditableRow;

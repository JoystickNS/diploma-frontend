import { ExclamationOutlined } from "@ant-design/icons";
import { Input, InputRef, Popconfirm, Row, Space } from "antd";
import { ChangeEvent, FC, memo, useRef, useState } from "react";
import { PopCodeConfirmProps } from "./PopCodeConfirm.interface";

const PopCodeConfirm: FC<PopCodeConfirmProps> = ({
  code,
  children,
  text,
  onOk,
}) => {
  const [isOkButtonDisabled, setIsOkButtonDisabled] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");

  const codeInputRef = useRef<InputRef>(null);

  const handleOnOk = () => {
    setInputText("");
    setIsOkButtonDisabled(true);
    onOk();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (code !== e.target.value) {
      setIsOkButtonDisabled(true);
    } else {
      setIsOkButtonDisabled(false);
    }
  };

  const handleVisibleChange = (visible: boolean) => {
    if (visible) {
      setTimeout(() => {
        codeInputRef.current?.select();
      }, 100);
    }
  };

  return (
    <Popconfirm
      icon={<ExclamationOutlined style={{ color: "red" }} />}
      onConfirm={handleOnOk}
      okText="Подтвердить"
      okButtonProps={{ disabled: isOkButtonDisabled }}
      onVisibleChange={handleVisibleChange}
      title={
        <Space direction="vertical">
          {text && <span>{text}</span>}
          <span>Введите код ({code}) для подтверждения операции:</span>
          <Row gutter={[0, 12]}>
            <Input
              value={inputText}
              ref={codeInputRef}
              size="small"
              onChange={handleInputChange}
            />
          </Row>
        </Space>
      }
    >
      {children}
    </Popconfirm>
  );
};

export default memo(PopCodeConfirm);

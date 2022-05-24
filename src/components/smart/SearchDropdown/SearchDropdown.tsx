import { FC, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputRef, Space } from "antd";
import { SearchDropdownProps } from "./SearchDropdown.interface";

const SearchDropdown: FC<SearchDropdownProps> = ({
  placeholder,
  confirm,
  setSearchInput,
  setIsFiltered,
  onSearch,
}) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (confirm: any) => {
    confirm();
    onSearch(searchText);
    if (searchText) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  };

  const handleReset = () => {
    setSearchText("");
  };

  const handleFilter = () => {
    confirm({ closeDropdown: false });
    onSearch(searchText);
    if (searchText) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  };

  return (
    <div style={{ padding: 8 }}>
      <Input
        ref={(node: InputRef) => {
          setSearchInput(node);
        }}
        placeholder={`Найти по ${placeholder}`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
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
          onClick={() => handleReset()}
          size="small"
          style={{ width: 90 }}
        >
          Сбросить
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            handleFilter();
          }}
        >
          Фильтр
        </Button>
      </Space>
    </div>
  );
};

export default SearchDropdown;

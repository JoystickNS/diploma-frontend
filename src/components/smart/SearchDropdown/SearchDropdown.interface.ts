import { InputRef } from "antd";
import { FilterConfirmProps } from "antd/lib/table/interface";

export interface SearchDropdownProps {
  placeholder: string;
  confirm: (param?: FilterConfirmProps) => void;
  setSearchInput: (input: InputRef) => void;
  setIsFiltered: (isFiltered: boolean) => void;
  onSearch: (value: string) => void;
}

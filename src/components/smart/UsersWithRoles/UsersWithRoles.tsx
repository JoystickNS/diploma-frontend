import { SearchOutlined } from "@ant-design/icons";
import { InputRef, message, Table } from "antd";
import { ColumnsType, FilterDropdownProps } from "antd/lib/table/interface";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { RoleName } from "../../../constants/permissions";
import { useGetRolesQuery } from "../../../services/roles/roles.service";
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetUsersQuery,
} from "../../../services/users/users.service";
import SearchDropdown from "../SearchDropdown/SearchDropdown";
import RoleItem from "./RoleItem/RoleItem";
import RolesDropdown from "./RolesDropdown/RolesDropdown";
import { IUserWithRolesTable } from "./UsersWithRoles.interface";

const UsersWithRoles: FC = () => {
  const [isFullNameFiltered, setIsFullNameFiltered] = useState<boolean>(false);
  const [isLoginFiltered, setIsLoginFiltered] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IUserWithRolesTable[]>();
  const [page, setPage] = useState<number>(1);
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(10);
  const [nameArg, setNameArg] = useState<string>();
  const [loginArg, setLoginArg] = useState<string>();

  const { data: usersData, isFetching: isUsersFetching } = useGetUsersQuery({
    skip,
    take,
    name: nameArg ? nameArg : undefined,
    login: loginArg ? loginArg : undefined,
  });
  const { data: rolesData, isFetching: isRolesFetching } = useGetRolesQuery();
  const [addRoleAPI] = useAddRoleMutation();
  const [deleteRoleAPI] = useDeleteRoleMutation();

  useEffect(() => {
    if (usersData) {
      setTableData(
        usersData.items.map((user) => ({
          key: user.id,
          fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
          login: user.login,
          roles: user.roles,
        }))
      );
    }
  }, [usersData]);

  let searchInput: InputRef;
  const setSearchInput = (input: InputRef) => {
    searchInput = input;
  };

  const handleNameSearch = (value: string) => {
    setNameArg(value);
  };

  const handleLoginSearch = (value: string) => {
    setLoginArg(value);
  };

  const handleAddRole = async (userId: number, roleId: number) => {
    await addRoleAPI({ roleId, userId });
    message.success("Роль успешно добавлена");
  };

  const handleDeleteRole = useCallback(
    async (userId: number, roleId: number) => {
      await deleteRoleAPI({ roleId, userId });
      message.success("Роль успешно удалена");
    },
    []
  );

  const handlePageChange = (page: number) => {
    setPage(page);
    setSkip(page * take - take);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setTake(size);
  };

  const getColumnSearchProps = (
    placeholder: string,
    isFiltered: boolean,
    setIsFiltered: (isFiltered: boolean) => void,
    onSearch: (value: string) => void
  ) => ({
    filterDropdown: ({ confirm }: FilterDropdownProps) => (
      <SearchDropdown
        placeholder={placeholder}
        confirm={confirm}
        setSearchInput={setSearchInput}
        setIsFiltered={setIsFiltered}
        onSearch={onSearch}
      />
    ),
    filterIcon: () => {
      return (
        <SearchOutlined style={{ color: isFiltered ? "#1890ff" : undefined }} />
      );
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100);
      }
    },
  });

  const columns: ColumnsType<IUserWithRolesTable> = useMemo(
    () => [
      {
        title: "ФИО",
        dataIndex: "fullName",
        width: "30%",
        render: (text) => (
          <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
            {text}
          </div>
        ),
        ...getColumnSearchProps(
          "фио",
          isFullNameFiltered,
          setIsFullNameFiltered,
          handleNameSearch
        ),
      },
      {
        title: "Логин",
        dataIndex: "login",
        width: "20%",
        render: (text) => (
          <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
            {text}
          </div>
        ),
        ...getColumnSearchProps(
          "логину",
          isLoginFiltered,
          setIsLoginFiltered,
          handleLoginSearch
        ),
      },
      {
        title: "Роли",
        dataIndex: "roles",
        key: "roles",
        textWrap: "word-break",
        width: "50%",
        render: (_, record: IUserWithRolesTable) => {
          const availableRoles = rolesData?.filter((role) =>
            record.roles.find((recordRole) => recordRole.id === role.id)
              ? false
              : true
          );
          const isRolesAvailable = availableRoles && availableRoles?.length > 0;
          return (
            <>
              {record.roles.map((role) => {
                let color;
                switch (role.role) {
                  case RoleName.Admin: {
                    color = "red";
                    break;
                  }
                  case RoleName.Teacher: {
                    color = "blue";
                    break;
                  }
                  case RoleName.Manager: {
                    color = "gold";
                  }
                }
                return (
                  <RoleItem
                    key={role.id}
                    color={color}
                    userId={record.key}
                    roleId={role.id}
                    roleName={role.name}
                    onDelete={handleDeleteRole}
                  />
                );
              })}
              {isRolesAvailable && (
                <RolesDropdown
                  userId={record.key}
                  roles={availableRoles}
                  onItemClick={handleAddRole}
                />
              )}
            </>
          );
        },
      },
    ],
    [rolesData, isFullNameFiltered, isLoginFiltered]
  );

  return (
    <Table<IUserWithRolesTable>
      bordered
      dataSource={tableData}
      columns={columns}
      size="small"
      loading={isUsersFetching || isRolesFetching}
      scroll={{ y: "max-content" }}
      pagination={{
        current: page,
        pageSize: take,
        showSizeChanger: true,
        total: usersData?.totalCount,
        onChange: (page: number) => handlePageChange(page),
        onShowSizeChange: (current: number, size: number) =>
          handlePageSizeChange(current, size),
      }}
    ></Table>
  );
};

export default UsersWithRoles;

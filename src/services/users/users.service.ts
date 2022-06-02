import { IArrayResult } from "../../models/ArrayResult";
import { IUserWithRoles } from "../../models/IUserWithRoles";
import { api } from "../api";
import { IUserRoleArgs, IUsersArgs } from "./users.interface";

export const usersAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IArrayResult<IUserWithRoles>, IUsersArgs>({
      query: (queryArgs) => ({
        url: "users",
        params: queryArgs,
      }),
      providesTags: ["Users"],
    }),

    addRole: builder.mutation<void, IUserRoleArgs>({
      query: (body) => ({
        url: "users-on-roles",
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    deleteRole: builder.mutation<void, IUserRoleArgs>({
      query: (body) => ({
        url: "users-on-roles",
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useAddRoleMutation, useDeleteRoleMutation } =
  usersAPI;

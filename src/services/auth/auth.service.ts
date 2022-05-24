import { IAuth } from "../../models/IAuth";
import { IRefresh } from "../../models/IRefresh";
import { IUserWithPermissions } from "../../models/IUserWithPermissions";
import { api } from "../api";
import { IAuthArgs } from "./auth.interface";

export const authAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuth, IAuthArgs>({
      query: (body) => ({
        url: "auth/login",
        method: "post",
        body,
      }),
    }),

    me: builder.query<IUserWithPermissions, void>({
      query: () => ({
        url: "auth/me",
      }),
    }),

    refresh: builder.mutation<IRefresh, void>({
      query: () => ({
        url: "auth/refresh",
        method: "put",
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "delete",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useRefreshMutation,
  useLogoutMutation,
} = authAPI;

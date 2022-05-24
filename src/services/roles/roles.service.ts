import { IRole } from "../../models/IRole";
import { api } from "../api";

export const rolesAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<IRole[], void>({
      query: () => ({
        url: "roles",
      }),
    }),
  }),
});

export const { useGetRolesQuery } = rolesAPI;

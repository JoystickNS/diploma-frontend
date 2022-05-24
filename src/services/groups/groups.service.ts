import { IDictionary } from "../../models/IDictionary";
import { api } from "../api";

export const groupsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<IDictionary[], void>({
      query: () => ({
        url: "groups",
      }),
    }),
  }),
});

export const { useGetGroupsQuery } = groupsAPI;

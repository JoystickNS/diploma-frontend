import { IGroup } from "../../models/IGroup";
import { api } from "../api";

export const groupsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<IGroup[], void>({
      query: () => ({
        url: "groups",
      }),
      providesTags: ["Groups"],
    }),
  }),
});

export const { useGetGroupsQuery } = groupsAPI;

import { IDictionary } from "../../models/IDictionary";
import { api } from "../api";

export const workTypesAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getWorkTypes: builder.query<IDictionary[], void>({
      query: () => ({
        url: "work-types",
      }),
    }),
  }),
});

export const { useGetWorkTypesQuery } = workTypesAPI;

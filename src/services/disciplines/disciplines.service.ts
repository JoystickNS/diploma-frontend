import { IDictionary } from "../../models/IDictionary";
import { api } from "../api";

export const disciplinesAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getDisciplines: builder.query<IDictionary[], void>({
      query: () => ({
        url: "disciplines",
      }),
    }),
  }),
});

export const { useGetDisciplinesQuery } = disciplinesAPI;

import { api } from "../api";
import { IImportManyStudentsAndGroupsArgs } from "./students.interface";

export const studentsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    importStudentsAndGroups: builder.mutation<
      void,
      IImportManyStudentsAndGroupsArgs
    >({
      query: (body) => ({
        url: "students",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Groups"],
    }),
  }),
});

export const { useImportStudentsAndGroupsMutation } = studentsAPI;

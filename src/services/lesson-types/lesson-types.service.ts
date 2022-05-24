import { IDictionary } from "../../models/IDictionary";
import { api } from "../api";

export const lessonTypesAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getLessonTypes: builder.query<IDictionary[], void>({
      query: () => ({
        url: "lesson-types",
      }),
    }),
  }),
});

export const { useGetLessonTypesQuery } = lessonTypesAPI;

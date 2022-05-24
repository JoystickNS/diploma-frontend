import { ILesson } from "../../models/ILesson";
import { api } from "../api";
import {
  IGetLessonsArgs,
  IUpdateLessonArgs,
  IUpdateManyLessonsArgs,
} from "./lessons.interface";

export const lessonsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<ILesson[], IGetLessonsArgs | undefined>({
      query: (queryArgs) => ({
        url: "lessons",
        params: queryArgs,
      }),
      providesTags: ["Lessons"],
    }),
    updateOneLesson: builder.mutation<ILesson, IUpdateLessonArgs>({
      query: (body) => ({
        url: `lessons/${body.id}`,
        method: "put",
        body,
      }),
    }),
    updateManyLessons: builder.mutation<void, IUpdateManyLessonsArgs>({
      query: (body) => ({
        url: "lessons/update-many",
        method: "put",
        body,
      }),
      invalidatesTags: ["Lessons"],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useUpdateOneLessonMutation,
  useUpdateManyLessonsMutation,
} = lessonsAPI;

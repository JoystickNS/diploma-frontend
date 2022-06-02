import { IDelete } from "../../models/IDelete";
import { ILesson } from "../../models/ILesson";
import { api } from "../api";
import {
  ICreateLessonArgs,
  ICreateManyLessonsArgs,
  IDeleteLessonArgs,
  IUpdateLessonArgs,
  IUpdateManyLessonsArgs,
} from "./lessons.interface";

export const lessonsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createLesson: builder.mutation<ILesson, ICreateLessonArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons`,
        method: "POST",
        body,
      }),
    }),

    createManyLessons: builder.mutation<ILesson[], ICreateManyLessonsArgs>({
      query: (body) => ({
        url: `journals/${body.items[0].journalId}/lessons/create-many`,
        method: "POST",
        body,
      }),
    }),

    updateLesson: builder.mutation<ILesson, IUpdateLessonArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}`,
        method: "PATCH",
        body,
      }),
    }),

    updateManyLessons: builder.mutation<ILesson[], IUpdateManyLessonsArgs>({
      query: (body) => ({
        url: `journals/${body.items[0].journalId}/lessons/update-many`,
        method: "PATCH",
        body,
      }),
    }),

    deleteLesson: builder.mutation<IDelete, IDeleteLessonArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateLessonMutation,
  useCreateManyLessonsMutation,
  useUpdateLessonMutation,
  useUpdateManyLessonsMutation,
  useDeleteLessonMutation,
} = lessonsAPI;

import { IDelete } from "../../models/IDelete";
import { IPoint } from "../../models/IPoint";
import { api } from "../api";
import {
  ICreatePointArgs,
  IDeletePointArgs,
  IUpdatePointArgs,
} from "./points.interface";

export const pointsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createPoint: builder.mutation<IPoint, ICreatePointArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}/students/${body.studentId}/points`,
        method: "POST",
        body,
      }),
    }),

    updatePoint: builder.mutation<IPoint, IUpdatePointArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}/students/${body.studentId}/points/${body.pointId}`,
        method: "PATCH",
        body,
      }),
    }),

    deletePoint: builder.mutation<IDelete, IDeletePointArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}/students/${body.studentId}/points/${body.pointId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePointMutation,
  useUpdatePointMutation,
  useDeletePointMutation,
} = pointsAPI;

import { IAnnotation } from "../../models/IAnnotation";
import { IDelete } from "../../models/IDelete";
import { api } from "../api";
import {
  ICreateAnnotationArgs,
  IDeleteAnnotationArgs,
  IUpdateAnnotationArgs,
} from "./annotations.interface";

export const annotationsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createAnnotation: builder.mutation<IAnnotation, ICreateAnnotationArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}/annotations`,
        method: "POST",
        body,
      }),
    }),

    updateAnnotation: builder.mutation<IAnnotation, IUpdateAnnotationArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}/annotations/${body.annotationId}`,
        method: "PATCH",
        body,
      }),
    }),

    deleteAnnotation: builder.mutation<IDelete, IDeleteAnnotationArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}/annotations/${body.annotationId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateAnnotationMutation,
  useUpdateAnnotationMutation,
  useDeleteAnnotationMutation,
} = annotationsAPI;

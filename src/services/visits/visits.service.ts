import { IVisit } from "../../models/IVisit";
import { api } from "../api";
import { IUpdateVisitArgs } from "./visits.interface";

export const visitsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    updateVisit: builder.mutation<IVisit, IUpdateVisitArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/lessons/${body.lessonId}/students/${body.studentId}/visits`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useUpdateVisitMutation } = visitsAPI;

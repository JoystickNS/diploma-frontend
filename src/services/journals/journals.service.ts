import { IJournalList } from "../../models/IJournalList";
import { IJournalFullInfo } from "../../models/IJournalFullInfo";
import { api } from "../api";
import {
  ICreateJournalArgs,
  ICreateJournalSubgroupArgs,
  IDeleteJournalSubgroupArgs,
  IJournalListArgs,
  IUpdateJournalSubgroupsStudentsArgs,
  IUpdateJournalSubgroupStudentArgs,
} from "./journals.interface";
import { IJournalUmkInfo } from "../../models/IJournalUmkInfo";
import { ISubgroup } from "../../models/ISubgroup";
import { IStudentSubgroup } from "../../models/IStudentSubgroup";

export const journalsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createJournal: builder.mutation<void, ICreateJournalArgs>({
      query: (body) => ({
        url: "journals",
        method: "post",
        body,
      }),
      invalidatesTags: ["Journals"],
    }),

    createJournalSubgroup: builder.mutation<
      ISubgroup,
      ICreateJournalSubgroupArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/subgroups`,
        method: "post",
        body,
      }),
    }),

    updateJournalSubgroupStudent: builder.mutation<
      IStudentSubgroup,
      IUpdateJournalSubgroupStudentArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/subgroups/${body.subgroupId}/students/${body.studentId}`,
        method: "put",
        body,
      }),
    }),

    updateManyJournalSubgroupStudent: builder.mutation<
      IStudentSubgroup[],
      IUpdateJournalSubgroupsStudentsArgs
    >({
      query: (body) => ({
        url: `journals/${body.items[0].journalId}/subgroups/students/`,
        method: "put",
        body,
      }),
    }),

    getJournalsList: builder.query<IJournalList[], IJournalListArgs>({
      query: (queryArgs) => ({
        url: "journals",
        params: queryArgs,
      }),
      providesTags: ["Journals"],
    }),

    getMyJournalsList: builder.query<IJournalList[], void>({
      query: () => ({
        url: "journals/my",
      }),
      providesTags: ["Journals"],
    }),

    getJournalsUmksList: builder.query<IJournalList[], IJournalListArgs>({
      query: (queryArgs) => ({
        url: "journals",
        params: queryArgs,
      }),
      providesTags: ["Journals"],
    }),

    getJournalUmkInfo: builder.query<IJournalUmkInfo, number>({
      query: (journalId) => ({
        url: `journals/${journalId}/umk-info`,
      }),
    }),

    getJournalFullInfo: builder.query<IJournalFullInfo, number>({
      query: (journalId) => ({
        url: `journals/${journalId}/full-info`,
      }),
      providesTags: ["JournalFullInfo"],
    }),

    deleteJournalSubgroup: builder.mutation<
      ISubgroup,
      IDeleteJournalSubgroupArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/subgroups/${body.subgroupId}`,
        method: "delete",
        body,
      }),
    }),
  }),
});

export const {
  useCreateJournalMutation,
  useCreateJournalSubgroupMutation,
  useUpdateJournalSubgroupStudentMutation,
  useUpdateManyJournalSubgroupStudentMutation,
  useGetJournalsListQuery,
  useGetMyJournalsListQuery,
  useGetJournalUmkInfoQuery,
  useGetJournalFullInfoQuery,
  useGetJournalsUmksListQuery,
  useDeleteJournalSubgroupMutation,
} = journalsAPI;

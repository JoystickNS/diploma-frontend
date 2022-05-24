import { IJournalList } from "../../models/IJournalList";
import { IJournalFullInfo } from "../../models/IJournalFullInfo";
import { api } from "../api";
import { ICreateJournalArgs, IJournalListArgs } from "./journals.interface";
import { IJournalUmkInfo } from "../../models/IJournalUmkInfo";

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
  }),
});

export const {
  useCreateJournalMutation,
  useGetJournalsListQuery,
  useGetMyJournalsListQuery,
  useGetJournalUmkInfoQuery,
  useGetJournalFullInfoQuery,
  useGetJournalsUmksListQuery,
} = journalsAPI;

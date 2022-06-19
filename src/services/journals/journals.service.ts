import { IJournalList } from "../../models/IJournalList";
import { IJournalFullInfo } from "../../models/IJournalFullInfo";
import { api } from "../api";
import {
  ICreateJournalArgs,
  IGetJournalListArgs,
  IUpdateJournalArgs,
} from "./journals.interface";
import { IJournalUmkInfo } from "../../models/IJournalUmkInfo";
import { IDelete } from "../../models/IDelete";
import { IArrayResult } from "../../models/ArrayResult";

export const journalsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createJournal: builder.mutation<void, ICreateJournalArgs>({
      query: (body) => ({
        url: "journals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Journals"],
    }),

    getAllJournalsList: builder.query<
      IArrayResult<IJournalList>,
      IGetJournalListArgs
    >({
      query: (queryArgs) => ({
        url: "journals",
        params: queryArgs,
      }),
      providesTags: ["Journals"],
    }),

    getMyJournalsList: builder.query<
      IArrayResult<IJournalList>,
      IGetJournalListArgs
    >({
      query: (queryArgs) => ({
        url: "journals/my",
        params: queryArgs,
      }),
      providesTags: ["Journals"],
    }),

    // getJournalsUmksList: builder.query<IJournalList[], IGetJournalListArgs>({
    //   query: (queryArgs) => ({
    //     url: "journals/umks",
    //     params: queryArgs,
    //   }),
    //   providesTags: ["Journals"],
    // }),

    getJournalUmkInfo: builder.query<IJournalUmkInfo, number>({
      query: (journalId) => ({
        url: `journals/${journalId}/umk-info`,
      }),
    }),

    getJournalFullInfo: builder.query<IJournalFullInfo, number>({
      query: (journalId) => ({
        url: `journals/${journalId}/full-info`,
      }),
      keepUnusedDataFor: 0,
    }),

    updateJournal: builder.mutation<void, IUpdateJournalArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Journals"],
    }),

    deleteJournal: builder.mutation<IDelete, number>({
      query: (journalId) => ({
        url: `journals/${journalId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Journals"],
    }),
  }),
});

export const {
  useCreateJournalMutation,
  useGetAllJournalsListQuery,
  useLazyGetAllJournalsListQuery,
  useGetMyJournalsListQuery,
  useGetJournalUmkInfoQuery,
  useGetJournalFullInfoQuery,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
} = journalsAPI;

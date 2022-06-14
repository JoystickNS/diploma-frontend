import { ISemesterGroupReport } from "../../models/ISemesterGroupReport";
import { api } from "../api";
import { IGetSemesterGroupReportArgs } from "./reports.interface";

export const reportsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getSemesterGroupReport: builder.query<
      ISemesterGroupReport,
      IGetSemesterGroupReportArgs
    >({
      query: (queryArgs) => ({
        url: "reports",
        params: queryArgs,
      }),
    }),
  }),
});

export const { useGetSemesterGroupReportQuery } = reportsAPI;

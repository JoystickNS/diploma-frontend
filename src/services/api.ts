import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../store/store";

export const baseURL = "http://localhost:3000/api";
// export const baseURL = "http://83.69.2.5:3000/api";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.accessToken;

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  reducerPath: "api",
  tagTypes: ["Journals", "Users", "JournalFullInfo", "Lessons"],
});

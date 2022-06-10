import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query";
import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { IRefresh } from "../models/IRefresh";
import {
  logoutAction,
  updateAccessTokenAction,
} from "../store/slices/auth/auth.slice";
import { RootState } from "../store/store";

// export const baseUrl = "http://localhost:3000/api";
export const baseUrl = "http://83.69.2.5:3000/api";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh",
        method: "PATCH",
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      api.dispatch(
        updateAccessTokenAction((refreshResult.data as IRefresh).accessToken)
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logoutAction());
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
  reducerPath: "api",
  tagTypes: ["Journals", "Users", "JournalFullInfo", "Lessons"],
});

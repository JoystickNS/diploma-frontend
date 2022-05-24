import { IDictionary } from "../../models/IDictionary";
import { api } from "../api";

export const controlsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getControls: builder.query<IDictionary[], void>({
      query: () => ({
        url: "controls",
      }),
    }),
  }),
});

export const { useGetControlsQuery } = controlsAPI;

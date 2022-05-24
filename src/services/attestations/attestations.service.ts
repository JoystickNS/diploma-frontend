import { IAttestation } from "../../models/IAttestation";
import { api } from "../api";
import { IUpdateAttestationArgs } from "./attestations.interface";

export const attestationsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    updateAttestation: builder.mutation<IAttestation, IUpdateAttestationArgs>({
      query: (body) => ({
        url: `attestations/${body.id}`,
        method: "put",
        body,
      }),
    }),
  }),
});

export const { useUpdateAttestationMutation } = attestationsAPI;

import { IAttestation } from "../../models/IAttestation";
import { IDelete } from "../../models/IDelete";
import { api } from "../api";
import {
  ICreateAttestationArgs,
  IDeleteAttestationArgs,
  IUpdateAttestationArgs,
} from "./attestations.interface";

export const attestationsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createAttestation: builder.mutation<IAttestation, ICreateAttestationArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/attestations`,
        method: "POST",
        body,
      }),
    }),

    updateAttestation: builder.mutation<IAttestation, IUpdateAttestationArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/attestations/${body.attestationId}`,
        method: "PATCH",
        body,
      }),
    }),

    deleteAttestation: builder.mutation<IDelete, IDeleteAttestationArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/attestations/${body.attestationId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateAttestationMutation,
  useUpdateAttestationMutation,
  useDeleteAttestationMutation,
} = attestationsAPI;

import { IAttestationOnStudent } from "../../models/IAttestationOnStudent";
import { api } from "../api";
import {
  ICreateAttestationOnStudentArgs,
  IDeleteAttestationOnStudentArgs,
  IUpdateAttestationOnStudentArgs,
} from "./attestations-on-students.interface";

export const attestationsOnStudentsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createAttestationOnStudent: builder.mutation<
      IAttestationOnStudent,
      ICreateAttestationOnStudentArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/attestations/${body.attestationId}/students/${body.studentId}`,
        method: "POST",
        body,
      }),
    }),

    updateAttestationOnStudent: builder.mutation<
      IAttestationOnStudent,
      IUpdateAttestationOnStudentArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/attestations/${body.attestationId}/students/${body.studentId}`,
        method: "PATCH",
        body,
      }),
    }),

    deleteAttestationOnStudent: builder.mutation<
      IDeleteAttestationOnStudentArgs,
      IDeleteAttestationOnStudentArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/attestations/${body.attestationId}/students/${body.studentId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateAttestationOnStudentMutation,
  useUpdateAttestationOnStudentMutation,
  useDeleteAttestationOnStudentMutation,
} = attestationsOnStudentsAPI;

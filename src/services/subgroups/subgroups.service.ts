import { api } from "../api";
import { ISubgroup } from "../../models/ISubgroup";
import { IStudentSubgroup } from "../../models/IStudentSubgroup";
import {
  ICreateSubgroupArgs,
  IUpdateSubgroupStudentArgs,
  IUpdateSubgroupsStudentsArgs,
  IDeleteSubgroupArgs,
  ICreateSubgroupStudentArgs,
} from "./subgroups.interface";
import { IDelete } from "../../models/IDelete";

export const subgroupsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubgroup: builder.mutation<ISubgroup, ICreateSubgroupArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/subgroups`,
        method: "POST",
        body,
      }),
    }),

    createSubgroupStudent: builder.mutation<
      IStudentSubgroup,
      ICreateSubgroupStudentArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/subgroups/${body.subgroupId}/students/${body.studentId}`,
        method: "POST",
        body,
      }),
    }),

    updateSubgroupStudent: builder.mutation<
      IStudentSubgroup,
      IUpdateSubgroupStudentArgs
    >({
      query: (body) => ({
        url: `journals/${body.journalId}/subgroups/${body.subgroupId}/students/${body.studentId}`,
        method: "PATCH",
        body,
      }),
    }),

    updateManySubgroupStudent: builder.mutation<
      IStudentSubgroup[],
      IUpdateSubgroupsStudentsArgs
    >({
      query: (body) => ({
        url: `journals/${body.items[0].journalId}/subgroups/students`,
        method: "PATCH",
        body,
      }),
    }),

    deleteSubgroup: builder.mutation<IDelete, IDeleteSubgroupArgs>({
      query: (body) => ({
        url: `journals/${body.journalId}/subgroups/${body.subgroupId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateSubgroupMutation,
  useCreateSubgroupStudentMutation,
  useUpdateManySubgroupStudentMutation,
  useUpdateSubgroupStudentMutation,
  useDeleteSubgroupMutation,
} = subgroupsAPI;

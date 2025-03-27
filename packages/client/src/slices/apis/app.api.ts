import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createGetQuery,
  createMutationParamQuery,
  createMutationQuery,
  headers,
} from "./config";
import { env } from "src/utils/env";
import { IPostArgs, IRDOORGRes } from "./types";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: env.API_URL,
    prepareHeaders: headers,
  }),

  endpoints: (builder) => ({
    post: builder.mutation(createMutationQuery<IPostArgs>("/")),
    rdoList: builder.query<IRDOORGRes, {}>(createGetQuery("/rdo-list")),
    orgList: builder.query<IRDOORGRes, {}>(createGetQuery("/org-list")),
    taskList: builder.query(createGetQuery("/tasks-list")),
    updateStatus: builder.mutation(
      createMutationParamQuery<{ status: string }, { id: string }>(
        "/task/:id/status",
        "PATCH",
      ),
    ),
  }),
});

export const {
  usePostMutation,
  useRdoListQuery,
  useOrgListQuery,
  useTaskListQuery,
  useUpdateStatusMutation,
} = apiSlice;

export const {} = apiSlice;

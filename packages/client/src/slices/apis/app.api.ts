import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createGetQuery, createMutationQuery, headers } from "./config";
import { env } from "src/utils/env";
import { IPostArgs } from "./types";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: env.API_URL,
    prepareHeaders: headers,
  }),

  endpoints: (builder) => ({
    post: builder.mutation(createMutationQuery<IPostArgs>("/")),
    // rdoList: builder.query<IRDOListRes, void>(createGetQuery("/rdo-list")),
    rdoList: builder.query(createGetQuery("/rdo-list")),
    orgList: builder.query(createGetQuery("/org-list")),
  }),
});

export const { usePostMutation, useRdoListQuery, useOrgListQuery } = apiSlice;

export const {} = apiSlice;

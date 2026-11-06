import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { TermsType } from "@/types/terms";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const termsApi = createApi({
  reducerPath: "termsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    createTerm: builder.mutation<Response<TermsType>, { content: string }>({
      query: (body) => {
        return {
          url: "/terms",
          method: "POST",
          body,
        };
      },
    }),
    updateTerm: builder.mutation<
      Response<null>,
      { content: string; id: string }
    >({
      query: ({ content, id }) => {
        return {
          url: `/terms/${id}`,
          method: "PUT",
          body: { content },
        };
      },
    }),
    deleteTerm: builder.mutation<Response<null>, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/terms/${id}`,
          method: "DELETE",
        };
      },
    }),
    getTerms: builder.query<Response<Array<TermsType>>, void>({
      query: () => {
        return {
          url: "/terms",
          method: "GET",
        };
      },
    }),
    getOneTerms: builder.query<Response<TermsType>, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/terms/${id}`,
          method: "GET",
        };
      },
    }),
    getLatestTerms: builder.query<Response<TermsType>, void>({
      query: () => {
        return {
          url: `/terms/accept`,
          method: "GET",
        };
      },
    }),
    acceptTerms: builder.mutation<Response<TermsType>, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/terms/accept/${id}`,
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useCreateTermMutation,
  useGetTermsQuery,
  useGetOneTermsQuery,
  useUpdateTermMutation,
  useDeleteTermMutation,
  useGetLatestTermsQuery,
  useAcceptTermsMutation,
} = termsApi;

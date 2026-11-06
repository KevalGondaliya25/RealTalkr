import { PaginationType } from "@/types";
import {
  AssistantBodyType,
  AssistantResponseType,
  AssistantSelectType,
  GetAllAssistantPayload,
  GetAllAssistantWithOutPagination,
  RandomAssistantRes,
} from "@/types/assistant";
import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const assistantApi = createApi({
  reducerPath: "assistantApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getRandomAssistant: builder.query<Response<RandomAssistantRes>, void>({
      query: () => ({
        url: "/assistant-random",
        method: "GET",
      }),
    }),
    getAllAssistant: builder.query<
      Response<PaginationType<Array<AssistantResponseType>>>,
      GetAllAssistantPayload
    >({
      query: ({
        page,
        limit,
        sort,
        startDate,
        search,
        organizationId,
        userId,
      }) => {
        let url = `/assistant?page=${page}&limit=${limit}`;
        if (startDate && startDate !== "") url += `&startDate=${startDate}`;
        if (search && search !== "") url += `&search=${search}`;
        if (userId) url += `&userId=${userId}`;
        if (organizationId && organizationId !== null)
          url += `&organizationId=${organizationId}`;
        if (sort) {
          url += `&sort[${sort.key}]=${sort.direction}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
    getAllAssistantWithOutPagination: builder.query<
      Response<Array<AssistantSelectType>>,
      GetAllAssistantWithOutPagination
    >({
      query: ({ organizationId, assistantType }) => {
        let url = `/assistant/all?`;
        if (organizationId && organizationId !== null)
          url += `organizationId=${organizationId}`;
        if (assistantType && assistantType !== "")
          url += `assistantType=${assistantType}`;

        return {
          url,
          method: "GET",
        };
      },
    }),
    getOneAssistant: builder.query<
      Response<AssistantResponseType>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/assistant/${id}`,
        method: "GET",
      }),
    }),
    createAssistant: builder.mutation<
      Response<AssistantResponseType>,
      AssistantBodyType
    >({
      query: (body) => ({
        url: "/assistant",
        method: "POST",
        body,
      }),
    }),

    loadModels: builder.query<
      Response<{ models: string[]; transcribers: string[]; voices: string[] }>, 
      void
    >({
      query: () => ({
        url: "/assistant",
        method: "OPTIONS",
      }),
    }),

    updateAssistant: builder.mutation<
      Response<null>,
      { id: number; data: Partial<AssistantBodyType> }
    >({
      query: ({ id, data }) => ({
        url: `/assistant/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAssistant: builder.mutation<Response<null>, { id: number }>({
      query: ({ id }) => ({
        url: `/assistant/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLazyGetRandomAssistantQuery,
  useGetAllAssistantQuery,
  useCreateAssistantMutation,
  useUpdateAssistantMutation,
  useDeleteAssistantMutation,
  useGetOneAssistantQuery,
  useLazyGetAllAssistantWithOutPaginationQuery,
  useGetAllAssistantWithOutPaginationQuery,
  useLazyLoadModelsQuery,
} = assistantApi;

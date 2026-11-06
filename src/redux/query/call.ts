import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AllCallsResponseType,
  CallStatisticsCostType,
  CallType,
  GetAllCallPayload,
  VapiPhoneNumber,
} from "@/types/call";
import { PaginationType } from "@/types";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getVapiPhoneNumbers: builder.query<Response<Array<VapiPhoneNumber>>, void>({
      query: () => ({
        url: "/vapi/phone",
        method: "GET",
      }),
    }),
    getCallStatistics: builder.query<
      Response<CallStatisticsCostType>,
      {
        startDate?: string;
        status?: string;
        organizationId?: number;
        assistantId?: number;
        userId?: number;
      }
    >({
      query: ({ startDate, status, organizationId, assistantId, userId }) => {
        let url = `/call/statistics`;
        const queryArray = [];
        if (startDate) queryArray.push(`startDate=${startDate}`);
        if (status) queryArray.push(`status=${status}`);
        if (organizationId) queryArray.push(`organizationId=${organizationId}`);
        if (assistantId) queryArray.push(`assistantId=${assistantId}`);
        if (userId) queryArray.push(`userId=${userId}`);

        if (queryArray.length > 0) {
          url += `?${queryArray.join("&")}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
    getAllCalls: builder.query<
      Response<PaginationType<Array<AllCallsResponseType>>>,
      Partial<GetAllCallPayload>
    >({
      query: ({
        page,
        limit,
        organizationId,
        search,
        callDuration,
        startDate,
        status,
        sort,
        userId,
      }) => {
        let url = `/call?page=${page}&limit=${limit}`;
        if (organizationId) url += `&organizationId=${organizationId}`;
        if (search) url += `&leadName=${search}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (callDuration) url += `&callDuration=${callDuration}`;
        if (userId) url += `&userId=${userId}`;
        if (status && status !== "All" && status !== "")
          url += `&status=${status.toLowerCase()}`;
        if (sort) {
          url += `&sort[${sort.key}]=${sort.direction}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
    getOneCalls: builder.query<Response<CallType>, { id: string }>({
      query: ({ id }) => ({
        url: `/call/${id}`,
        method: "GET",
      }),
    }),
    addNotes: builder.mutation<Response<null>, { notes: string; id: number }>({
      query: ({ id, notes }) => ({
        url: `/call/${id}`,
        method: "PUT",
        body: {
          notes,
        },
      }),
    }),
  }),
});

export const {
  useGetVapiPhoneNumbersQuery,
  useGetCallStatisticsQuery,
  useGetAllCallsQuery,
  useGetOneCallsQuery,
  useAddNotesMutation,
} = callApi;

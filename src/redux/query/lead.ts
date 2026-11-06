import {
  BulkLead,
  FailLeadQueryType,
  FailLeadType,
  GetAllLeadPayload,
  LeadBodyType,
  LeadBulkBodyType,
  LeadType,
  SingleLeadBodyType,
} from "@/types/lead";
import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PaginationType } from "@/types";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const leadApi = createApi({
  reducerPath: "leadApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getLeads: builder.query<
      Response<PaginationType<Array<LeadType>>>,
      GetAllLeadPayload
    >({
      query: ({
        organizationId,
        page,
        limit,
        sort,
        status,
        startDate,
        search,
        userId,
      }) => {
        let url = `/lead?page=${page}&limit=${limit}`;

        if (organizationId) url += `&organizationId=${organizationId}`;
        if (userId) url += `&userId=${userId}`;
        if (status && status !== "" && status !== "All")
          url += `&status=${status.toLowerCase()}`;
        if (startDate && startDate !== "") url += `&startDate=${startDate}`;
        if (search && search !== "") url += `&search=${search}`;
        if (sort) {
          url += `&sort[${sort.key}]=${sort.direction}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
    getBulkLeads: builder.query<
      Response<PaginationType<Array<BulkLead>>>,
      GetAllLeadPayload
    >({
      query: ({ organizationId, page, limit }) => {
        let url = `/bulk-lead?page=${page}&limit=${limit}`;

        if (organizationId) url += `&organizationId=${organizationId}`;
        return {
          url,
          method: "GET",
        };
      },
    }),
    getOneBulkLeads: builder.query<Response<BulkLead>, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/bulk-lead/${id}`,
          method: "GET",
        };
      },
    }),
    getOneLeads: builder.query<Response<LeadType>, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/lead/${id}`,
          method: "GET",
        };
      },
    }),
    createLead: builder.mutation<Response<LeadType>, SingleLeadBodyType>({
      query: (body) => ({
        url: "/lead",
        method: "POST",
        body,
      }),
    }),
    createBulkLead: builder.mutation<Response<LeadType>, LeadBulkBodyType>({
      query: (body) => ({
        url: "/bulk-lead",
        method: "POST",
        body,
      }),
    }),
    updateLead: builder.mutation<
      Response<null>,
      { id: number; data: Partial<LeadBodyType> }
    >({
      query: ({ id, data }) => ({
        url: `/lead/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteLead: builder.mutation<Response<null>, { id: number }>({
      query: ({ id }) => ({
        url: `/lead/${id}`,
        method: "DELETE",
      }),
    }),
    deleteBulkLead: builder.mutation<Response<null>, { id: number }>({
      query: ({ id }) => ({
        url: `/bulk-lead/${id}`,
        method: "DELETE",
      }),
    }),
    updateBulkLead: builder.mutation<
      Response<null>,
      { id: number; data: Partial<LeadBulkBodyType> }
    >({
      query: ({ id, data }) => ({
        url: `/bulk-lead/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    validateBulkLead: builder.query<
      Response<Array<string>>,
      { contacts: Array<string>; organizationId?: number }
    >({
      query: ({ contacts, organizationId }) => {
        let url = "/lead/validate";
        if (organizationId) {
          url += `?organizationId=${organizationId}`;
        }
        if (contacts.length > 0) {
          url += `${url.includes("?") ? "&" : "?"}${contacts
            .map((contact) => `contact=${contact}`)
            .join("&")
            .replaceAll("+", "%2B")}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
    getFailLead: builder.query<
      Response<PaginationType<Array<FailLeadType>>>,
      FailLeadQueryType
    >({
      query: ({ page, limit, search, startDate }) => {
        let url = `/fail-lead?page=${page}&limit=${limit}`;
        if (search && search !== "") url += `&search=${search}`;
        if (startDate && startDate !== "") url += `&startDate=${startDate}`;

        return {
          url,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useDeleteBulkLeadMutation,
  useGetOneLeadsQuery,
  useLazyGetOneLeadsQuery,
  useCreateBulkLeadMutation,
  useGetBulkLeadsQuery,
  useGetOneBulkLeadsQuery,
  useUpdateBulkLeadMutation,
  useLazyValidateBulkLeadQuery,
  useGetFailLeadQuery,
} = leadApi;

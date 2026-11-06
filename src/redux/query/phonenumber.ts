import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PaginationType } from "@/types";
import {
  GetAllPhoneNumberPayload,
  GetPhoneNumber,
  PhoneNumberBodyType,
  PhoneNumberEditBodyType,
  PhoneNumberType,
} from "@/types/phone-number";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const phoneNumberApi = createApi({
  reducerPath: "phoneNumberApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getPhoneNumber: builder.query<
      Response<PaginationType<Array<GetPhoneNumber>>>,
      GetAllPhoneNumberPayload
    >({
      query: ({ organizationId, page, limit, userId, search }) => {
        let url = `/phone-number?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (organizationId) url += `&organizationId=${organizationId}`;
        if (userId) url += `&userId=${userId}`;
        return {
          url,
          method: "GET",
        };
      },
    }),
    getOnePhoneNumber: builder.query<Response<PhoneNumberType>, { id: string }>(
      {
        query: ({ id }) => {
          return {
            url: `/phone-number/${id}`,
            method: "GET",
          };
        },
      }
    ),
    createPhoneNumber: builder.mutation<
      Response<PhoneNumberType>,
      PhoneNumberBodyType
    >({
      query: (body) => ({
        url: "/phone-number",
        method: "POST",
        body,
      }),
    }),
    updatePhoneNumber: builder.mutation<
      Response<null>,
      { id: number; data: Partial<PhoneNumberEditBodyType> }
    >({
      query: ({ id, data }) => ({
        url: `/phone-number/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePhoneNumber: builder.mutation<Response<null>, { id: number }>({
      query: ({ id }) => ({
        url: `/phone-number/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePhoneNumberMutation,
  useUpdatePhoneNumberMutation,
  useDeletePhoneNumberMutation,
  useGetPhoneNumberQuery,
  useGetOnePhoneNumberQuery,
} = phoneNumberApi;

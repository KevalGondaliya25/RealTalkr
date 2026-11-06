import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GetAllUserPayload, UserType } from "@/types/user";
import { PaginationType } from "@/types";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<
      Response<
        PaginationType<{
          user?: UserType;
          users: Array<UserType>;
        }>
      >,
      GetAllUserPayload
    >({
      query: ({ page, limit, sort, search, startDate, userId }) => {
        let url = `/user?page=${page}&limit=${limit}`;
        if (startDate && startDate !== "") url += `&startDate=${startDate}`;
        if (search && search !== "") url += `&search=${search}`;
        if (userId && userId !== "") url += `&userId=${userId}`;
        if (sort) {
          url += `&sort[${sort.key}]=${sort.direction}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
    updateUser: builder.mutation<
      Response<null>,
      { id: number; data: Partial<UserType> }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserMutation } = userApi;

import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PaginationType } from "@/types";
import { NotificationType } from "@/types/notification";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getNotification: builder.query<
      Response<
        PaginationType<{
          unReadCount: number;
          notifications: Array<NotificationType>;
        }>
      >,
      { page: number; organizationId?: number; limit: number; search: string }
    >({
      query: ({ page, organizationId, limit, search }) => {
        let url = `/notification?page=${page}&limit=${limit}`;
        if (organizationId) url += `&organizationId=${organizationId}`;
        if (search && search !== "all") url += `&search=${search}`;
        return {
          url: url,
          method: "GET",
        };
      },
    }),
    readNotification: builder.mutation<Response<null>, { ids: Array<number> }>({
      query: (body) => ({
        url: "/notification/read",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useGetNotificationQuery, useReadNotificationMutation } =
  notificationApi;

import {
  OrganizationCreatePayload,
  OrganizationType,
} from "@/types/organization";
import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getOrganization: builder.query<
      Response<Array<OrganizationType>>,
      { search?: string; dataType?: string; userId?: string }
    >({
      query: ({ search, dataType, userId }) => {
        const params = new URLSearchParams();
        if (search && search !== "") params.append("search", search);
        else if (dataType && dataType === "all")
          params.append("dataType", dataType);
        if (userId && userId !== "") params.append("userId", userId);

        return {
          url: `/organization?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    createOrganization: builder.mutation<
      Response<OrganizationType>,
      OrganizationCreatePayload
    >({
      query: (body) => ({
        url: "/organization",
        method: "POST",
        body,
      }),
    }),
    updateOrganization: builder.mutation<
      Response<null>,
      { id: number; data: Partial<OrganizationType> }
    >({
      query: ({ id, data }) => ({
        url: `/organization/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteOrganization: builder.mutation<Response<null>, { id: number }>({
      query: ({ id }) => ({
        url: `/organization/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useLazyGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;

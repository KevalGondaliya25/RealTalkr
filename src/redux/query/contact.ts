import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Response } from "@/types/response";
import { BASE_URL } from "@/utils/constant";
import { ContactBodyType, ContactResponseType } from "@/types/contact";

export const contactUsApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    createContactUs: builder.mutation<
      Response<ContactResponseType>,
      ContactBodyType
    >({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateContactUsMutation } = contactUsApi;

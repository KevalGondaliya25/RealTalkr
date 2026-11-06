import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/redux/customBaseQuery";
import { ModelPayload } from "@/types/models"; // adjust import if needed

export const modelApi = createApi({
  reducerPath: "modelApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
      getModels: builder.query<ModelPayload, void>({
        query: () => ({
          url: "/models",
          method: "GET",
        }),
        transformResponse: (response: Response<ModelPayload>) => {
          console.log("[modelApi] getModels response", response.data.transcriber);
          return response.data;
        },
      }),
      updateModel: builder.mutation<ModelPayload, Partial<ModelPayload>>({
        query: (body) => ({
          url: "/models",
          method: "PUT",
          body,
        }),
        transformResponse: (response: Response<ModelPayload>) => response.data,
      }),
    }),
});

export const { useGetModelsQuery, useUpdateModelMutation } = modelApi;
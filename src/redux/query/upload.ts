import { Response } from "@/types/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { UploadFileType } from "@/types/file-upload";
import { customBaseQuery } from "@/redux/customBaseQuery";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    uploadFile: builder.mutation<Response<UploadFileType>, any>({
      query: (body) => ({
        url: "/upload",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;

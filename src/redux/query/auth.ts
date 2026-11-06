import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignupResponseType, UserBodyType, UserType } from "@/types/user";
import { Response } from "@/types/response";
import { BASE_URL } from "@/utils/constant";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    signup: builder.mutation<Response<SignupResponseType>, UserBodyType>({
      query: (body) => ({
        url: "/auth/sign-up",
        method: "POST",
        body,
      }),
    }),
    forgot: builder.mutation<Response<null>, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot",
        method: "POST",
        body,
      }),
    }),
    verifyCaptcha: builder.mutation<
      Response<{ score: number }>,
      { token: string }
    >({
      query: (body) => ({
        url: "/auth/verify/captcha",
        method: "POST",
        body,
      }),
    }),
    verify: builder.mutation<
      Response<null>,
      { password: string; resetToken: string }
    >({
      query: (body) => ({
        url: `/auth/verify?resetToken=${body.resetToken}`,
        method: "PUT",
        body: {
          password: body.password,
        },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyMutation,
  useForgotMutation,
  useVerifyCaptchaMutation,
} = authApi;

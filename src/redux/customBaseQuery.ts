import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { logout, setToken } from "@/redux/slice/user";
import { RootState } from "@/redux/store";
import { BASE_URL } from "@/utils/constant";

// Prevent multiple refresh calls
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
const baseQueryForRefreshToken = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const refreshToken = (getState() as RootState).user.refreshToken;
    if (refreshToken) headers.set("x-refresh-token", `${refreshToken}`);
    const token = (getState() as RootState).user.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const customBaseQuery: BaseQueryFn<
  any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock(); // wait if refresh is in progress
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // prevent simultaneous refresh attempts
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // try refresh
        const refreshResult = await baseQueryForRefreshToken(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newAccessToken = (refreshResult.data as any).data.accessToken;
          api.dispatch(setToken({ token: newAccessToken }));

          // retry the original query with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
          // Optional: Sign out of NextAuth
          if (typeof window !== "undefined") {
            const { signOut } = await import("next-auth/react");
            signOut({ callbackUrl: "/" });
          }
        }
      } finally {
        release(); // release mutex
      }
    } else {
      await mutex.waitForUnlock(); // wait if another refresh is ongoing
      result = await baseQuery(args, api, extraOptions); // retry original query
    }
  }

  return result;
};

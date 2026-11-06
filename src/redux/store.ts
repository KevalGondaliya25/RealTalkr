import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import { createWhitelistFilter } from "redux-persist-transform-filter";

import userReducer from "@/redux/slice/user";
import { authApi } from "@/redux/query/auth";
import { leadApi } from "@/redux/query/lead";
import { userApi } from "@/redux/query/user";
import { callApi } from "@/redux/query/call";
import { uploadApi } from "@/redux/query/upload";
import { contactUsApi } from "@/redux/query/contact";
import { assistantApi } from "@/redux/query/assistant";
import { organizationApi } from "@/redux/query/organization";
import { notificationApi } from "@/redux/query/notification";
import { termsApi } from "@/redux/query/terms";
import { phoneNumberApi } from "./query/phonenumber";
import { modelApi } from "@/redux/query/model"; 


const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const storeSelectedUser = createWhitelistFilter("user", [
  "token",
  "refreshToken",
  "user",
  "organizationId",
  "userId",
]);

const persistConfig = {
  key: "root:ai-voice",
  storage,
  version: 1,
  transforms: [storeSelectedUser],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    [authApi.reducerPath]: authApi.reducer,
    [leadApi.reducerPath]: leadApi.reducer,
    [assistantApi.reducerPath]: assistantApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [callApi.reducerPath]: callApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [termsApi.reducerPath]: termsApi.reducer,
    [contactUsApi.reducerPath]: contactUsApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [phoneNumberApi.reducerPath]: phoneNumberApi.reducer,
    [modelApi.reducerPath]: modelApi.reducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(
      authApi.middleware,
      leadApi.middleware,
      assistantApi.middleware,
      organizationApi.middleware,
      userApi.middleware,
      callApi.middleware,
      notificationApi.middleware,
      termsApi.middleware,
      contactUsApi.middleware,
      uploadApi.middleware,
      phoneNumberApi.middleware,
      modelApi.middleware
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

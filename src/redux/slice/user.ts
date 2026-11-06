import { RootState } from "@/redux/store";
import { UserPayloadType, UserSliceStateType } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserSliceStateType = {
  token: null,
  refreshToken: null,
  user: null,
  organizationId: null,
  userId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserPayloadType>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    setRefreshToken: (
      state,
      action: PayloadAction<{ refreshToken: string }>
    ) => {
      state.refreshToken = action.payload.refreshToken;
    },
    setOrganization: (state, action: PayloadAction<{ id: number | null }>) => {
      state.organizationId = action.payload.id;
    },
    setUserId: (state, action: PayloadAction<{ id: number | null }>) => {
      state.userId = action.payload.id;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.organizationId = null;
      state.userId = null;
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectCurrentToken = (state: RootState) => state.user.token;
export const selectCurrentRefreshToken = (state: RootState) =>
  state.user.refreshToken;
export const selectCurrentOrganizationId = (state: RootState) =>
  state.user.organizationId;

export const selectCurrentUserId = (state: RootState) => state.user.userId;

export const {
  setCredentials,
  logout,
  setOrganization,
  setUserId,
  setToken,
  setRefreshToken,
} = userSlice.actions;
export default userSlice.reducer;

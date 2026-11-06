export type UserBodyType = {
  name: string;
  password: string;
  email: string;
  summaryNotificationTime: Date;
  offSet: number;
  timeZone: string;
  agree: boolean;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  isEnable: boolean;
  termsAndCondition: boolean;
  role: $Enums.Role;
  profileImg?: string;
  fileName?: string;
  fileType?: string;
  notificationSetting: Array<string>;
  createdAt: Date;
  updatedAt: Date;
};

export type SignInBody = {
  email: string;
  password: string;
};

export type SignupResponseType = {
  token: string;
  user: UserType;
};

export type UserSliceStateType = {
  token: string | null;
  refreshToken: string | null;
  user: UserType | null;
  organizationId: number | null;
  userId: number | null;
};

export type UserPayloadType = {
  token: string | null;
  refreshToken: string | null;
  user: UserType | null;
};

export type GetAllUserPayload = {
  page: number;
  limit: number;
  sort?: {
    key: keyof UserType;
    direction: "asc" | "desc" | null;
  };
  startDate?: string | null;
  search?: string | null;
  userId?: string | null;
};

export type UpdateUserResponseType = {
  name: string;
  email: string;
  isEnable: boolean;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
};

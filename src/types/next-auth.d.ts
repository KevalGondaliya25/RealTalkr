import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    token: string;
    refreshToken: string;
    role: string;
    profileImg?: string;
    fileName?: string;
    fileType?: string;
    isEnable: boolean;
    notificationSetting: Array<string>;
    termsAndCondition: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    token: string;
    refreshToken: string;
    role: string;
    profileImg?: string;
    fileName?: string;
    fileType?: string;
    isEnable: boolean;
    notificationSetting: Array<string>;
    termsAndCondition: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}

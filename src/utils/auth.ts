import axios from "axios";
import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import { BASE_URL } from "./constant";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/sign-in`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (data.success) {
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role,
              isEnable: data.data.user.isEnable,
              profileImg: data.data.user.profileImg,
              fileName: data.data.user.fileName,
              fileType: data.data.user.fileType,
              createdAt: data.data.user.createdAt,
              notificationSetting: data.data.user.notificationSetting,
              updatedAt: data.data.user.updatedAt,
              termsAndCondition: data.data.user.termsAndCondition,
              token: data.data.token,
              refreshToken: data.data.refreshToken,
            };
          } else {
            throw new Error(data.message || "Authentication failed.");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.data.message) {
              throw new Error(error.response.data.message);
            } else {
              throw new Error(error.message || "An unexpected error occurred");
            }
          } else {
            throw new Error("Internal server error.");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.token = user.token;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.isEnable = user.isEnable;
        token.termsAndCondition = user.termsAndCondition;
        token.profileImg = user.profileImg;
        token.fileName = user.fileName;
        token.fileType = user.fileType;
        token.createdAt = user.createdAt;
        token.notificationSetting = user.notificationSetting;
        token.updatedAt = user.updatedAt;
      }

      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.profileImg = session.user.profileImg;
        token.fileName = session.user.fileName;
        token.fileType = session.user.fileType;
        token.notificationSetting = session.user.notificationSetting;
        token.termsAndCondition = session.user.termsAndCondition;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email!;
        session.user.name = token.name!;
        session.user.token = token.token as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.role = token.role as string;
        session.user.profileImg = token.profileImg as string | undefined;
        session.user.fileName = token.fileName as string | undefined;
        session.user.fileType = token.fileType as string | undefined;
        session.user.isEnable = token.isEnable as boolean;
        session.user.notificationSetting =
          token.notificationSetting as Array<string>;
        session.user.termsAndCondition = token.termsAndCondition as boolean;
        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;
      }
      return session;
    },
  },
  // cookies: {
  //   sessionToken: {
  //     name: `next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.ENV === "production",
  //     },
  //   },
  // },
};

export default NextAuth(authOptions);

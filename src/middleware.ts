import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { DASHBOARD_PAGE } from "./utils/constant";

const protectedRoutes: Array<string> = [
  "/assistant",
  "/call-logs",
  "/dashboard",
  "/organization",
  "/setting",
  "/lead",
  "/user",
  "/agent",
  "/bulk-lead",
  "/terms",
  "/phone-number",
  "/notification",
];

const publicRoutes: Array<string> = [];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const token = await getToken({ req });

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL(DASHBOARD_PAGE, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

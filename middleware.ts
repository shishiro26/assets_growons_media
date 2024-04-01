import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  adminAuthPrefix,
  apiAuthPrefix,
  authRoutes,
  proAuthPrefix,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";
import { currentRole, currentUserId } from "./lib/auth";
import next from "next";
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAdminRoute = nextUrl.pathname.startsWith(adminAuthPrefix);
  const isApiProRoute = nextUrl.pathname.startsWith(proAuthPrefix);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  const role = await currentRole();

  const userId = await currentUserId();

  if (nextUrl.pathname.startsWith("/money")) {
    const urlSuffix = nextUrl.pathname.split("/")[3];
    if (urlSuffix !== userId) {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  if (isApiAdminRoute) {
    if (role !== "ADMIN") {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  if (isApiProRoute) {
    if (role !== "ADMIN" && role !== "PRO") {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

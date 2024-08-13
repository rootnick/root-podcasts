import { NextRequest, NextResponse } from "next/server";
import { STATICTICS_LINK, MAIN_LINK } from "@/constants";

const isAuth = (request: NextRequest) => {
  return request.cookies.has("user");
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isAuth(request) && pathname.startsWith(STATICTICS_LINK)) {
    return NextResponse.redirect(new URL(MAIN_LINK, request.url));
  }
  return NextResponse.next();
}

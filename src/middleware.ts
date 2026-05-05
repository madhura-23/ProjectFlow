import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/sign-in", "/sign-up", "/verify-email"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC.some((p) => pathname.startsWith(p));
  // For demo: skip auth check - add real token check when Cognito is configured
  if (isPublic) return NextResponse.next();
  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "./config/nextauth";

const guestRoutes = ["/sign-in", "/sign-up"];
const publicRoutes = ["/"];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const session = await getAuthSession();
  const { pathname } = request.nextUrl;

  const isGuestRoute = guestRoutes.includes(pathname);
  if (!session?.user && !isGuestRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("from_protected", "true");
    return NextResponse.redirect(url);
  }
  if (session?.user && isGuestRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  const userData = request.cookies.get("userData")?.value;

  if (token && userData) {
    try {
      const decodedUserData = decodeURIComponent(userData);
      const parsedUserData = JSON.parse(decodedUserData);
      if (parsedUserData.role === "admin") {
        return NextResponse.next(); // Allow access to /admin
      }
    } catch (error) {
      console.error("Error parsing userData cookie:", error);
    }
  }

  // Redirect to login if not authenticated or not admin
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};

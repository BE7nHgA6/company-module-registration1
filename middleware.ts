// JWT authentication middleware
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ["/api/company", "/dashboard"]

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. No token provided.",
          error: "No token",
        },
        { status: 401 },
      )
    }

    // Verify JWT token
    const decoded = verifyToken(token)

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId.toString())
    requestHeaders.set("x-user-email", decoded.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid token",
        error: "Token verification failed",
      },
      { status: 401 },
    )
  }
}

export const config = {
  matcher: ["/api/company/:path*", "/dashboard/:path*"],
}

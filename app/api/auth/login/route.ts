// User login API endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { comparePassword, generateToken } from "@/lib/auth"
import { FirebaseAuthService } from "@/lib/firebase"
import type { LoginRequest, ApiResponse } from "@/types/database"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Email and password are required",
          error: "Missing credentials",
        },
        { status: 400 },
      )
    }

    // Find user in database
    const result = await query(
      "SELECT id, email, password, full_name, is_email_verified, is_mobile_verified FROM users WHERE email = $1",
      [email],
    )

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid email or password",
          error: "User not found",
        },
        { status: 401 },
      )
    }

    const user = result.rows[0]

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid email or password",
          error: "Invalid password",
        },
        { status: 401 },
      )
    }

    // Authenticate with Firebase
    await FirebaseAuthService.loginWithEmail(email, password)

    // Generate JWT token (90-day validity)
    const token = generateToken(user.id, user.email)

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            is_email_verified: user.is_email_verified,
            is_mobile_verified: user.is_mobile_verified,
          },
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Login failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

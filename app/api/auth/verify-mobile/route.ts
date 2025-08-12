// Mobile OTP verification API endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { FirebaseAuthService } from "@/lib/firebase"
import type { ApiResponse } from "@/types/database"

export async function POST(request: NextRequest) {
  try {
    const { mobile_no, otp } = await request.json()

    if (!mobile_no || !otp) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Mobile number and OTP are required",
          error: "Missing parameters",
        },
        { status: 400 },
      )
    }

    // Verify OTP with Firebase
    const isOTPValid = await FirebaseAuthService.verifySMSOTP(mobile_no, otp)

    if (!isOTPValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid OTP",
          error: "OTP verification failed",
        },
        { status: 400 },
      )
    }

    // Update mobile verification status in database
    const result = await query("UPDATE users SET is_mobile_verified = true WHERE mobile_no = $1 RETURNING id, email", [
      mobile_no,
    ])

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
          error: "User not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Mobile number verified successfully",
        data: { user_id: result.rows[0].id },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Mobile verification error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Mobile verification failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

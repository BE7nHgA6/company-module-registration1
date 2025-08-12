// User registration API endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { hashPassword } from "@/lib/auth"
import { FirebaseAuthService } from "@/lib/firebase"
import type { RegisterUserRequest, ApiResponse } from "@/types/database"

export async function POST(request: NextRequest) {
  try {
    const body: RegisterUserRequest = await request.json()
    const { email, password, full_name, gender, mobile_no, signup_type } = body

    // Validate required fields
    if (!email || !password || !full_name || !gender || !mobile_no) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields are required",
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid email format",
          error: "Invalid email",
        },
        { status: 400 },
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Password must be at least 8 characters long",
          error: "Weak password",
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1 OR mobile_no = $2", [email, mobile_no])

    if (existingUser.rows.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User with this email or mobile number already exists",
          error: "User exists",
        },
        { status: 409 },
      )
    }

    // Create user in Firebase
    await FirebaseAuthService.registerWithEmail(email, password)

    // Hash password for database storage
    const hashedPassword = await hashPassword(password)

    // Insert user into database
    const result = await query(
      `INSERT INTO users (email, password, full_name, signup_type, gender, mobile_no) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, full_name`,
      [email, hashedPassword, full_name, signup_type, gender, mobile_no],
    )

    const newUser = result.rows[0]

    // Send SMS OTP for mobile verification
    await FirebaseAuthService.sendSMSOTP(mobile_no)

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User registered successfully. Please verify mobile OTP.",
        data: { user_id: newUser.id, email: newUser.email, full_name: newUser.full_name },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Registration failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { applyActionCode } from "firebase/auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const oobCode = searchParams.get("oobCode")
    const email = searchParams.get("email")

    if (!oobCode || !email) {
      return NextResponse.json({ success: false, message: "Invalid verification link" }, { status: 400 })
    }

    // Verify email with Firebase
    await applyActionCode(auth, oobCode)

    // Update database
    await query("UPDATE users SET is_email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE email = $1", [email])

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ success: false, message: "Email verification failed" }, { status: 400 })
  }
}

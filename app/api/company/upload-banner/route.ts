// Company banner upload API endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { CloudinaryService } from "@/lib/cloudinary"
import type { ApiResponse } from "@/types/database"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not authenticated",
          error: "No user ID",
        },
        { status: 401 },
      )
    }

    // Check if user has a company profile
    const companyResult = await query("SELECT id, company_name FROM company_profile WHERE owner_id = $1", [userId])

    if (companyResult.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Company profile not found",
          error: "No company profile",
        },
        { status: 404 },
      )
    }

    const company = companyResult.rows[0]
    const formData = await request.formData()
    const file = formData.get("banner") as File

    if (!file) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "No file provided",
          error: "Missing file",
        },
        { status: 400 },
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "File must be an image",
          error: "Invalid file type",
        },
        { status: 400 },
      )
    }

    // Validate file size (max 10MB for banners)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "File size must be less than 10MB",
          error: "File too large",
        },
        { status: 400 },
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.uploadImage(buffer, "company-banners", `company-${company.id}-banner`)

    // Update company profile with banner URL
    await query("UPDATE company_profile SET banner_url = $1 WHERE id = $2", [uploadResult.secure_url, company.id])

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Banner uploaded successfully",
        data: {
          banner_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Banner upload error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Banner upload failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

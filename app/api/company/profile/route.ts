// Company profile API endpoints
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { ApiResponse } from "@/types/database"

export async function GET(request: NextRequest) {
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

    const result = await query(`SELECT * FROM company_profile WHERE owner_id = $1`, [userId])

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Company profile not found",
          error: "Profile not found",
        },
        { status: 404 },
      )
    }

    const profile = result.rows[0]

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Company profile retrieved successfully",
        data: profile,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Get company profile error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to retrieve company profile",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const {
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      industry,
      founded_date,
      description,
      social_links,
    } = body

    // Validate required fields
    if (!company_name || !address || !city || !state || !country || !postal_code || !industry) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All required fields must be provided",
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Update company profile
    const result = await query(
      `UPDATE company_profile 
       SET company_name = $2, address = $3, city = $4, state = $5, country = $6, 
           postal_code = $7, website = $8, industry = $9, founded_date = $10, 
           description = $11, social_links = $12, updated_at = CURRENT_TIMESTAMP
       WHERE owner_id = $1 
       RETURNING id, company_name`,
      [
        userId,
        company_name,
        address,
        city,
        state,
        country,
        postal_code,
        website || null,
        industry,
        founded_date || null,
        description || null,
        social_links ? JSON.stringify(social_links) : null,
      ],
    )

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Company profile not found",
          error: "Profile not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Company profile updated successfully",
        data: result.rows[0],
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Update company profile error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to update company profile",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

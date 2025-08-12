// Company registration API endpoint
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { CompanyRegistrationRequest, ApiResponse } from "@/types/database"

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

    const body: CompanyRegistrationRequest = await request.json()
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

    // Check if user already has a company profile
    const existingProfile = await query("SELECT id FROM company_profile WHERE owner_id = $1", [userId])

    if (existingProfile.rows.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Company profile already exists for this user",
          error: "Profile exists",
        },
        { status: 409 },
      )
    }

    // Insert company profile
    const result = await query(
      `INSERT INTO company_profile 
       (owner_id, company_name, address, city, state, country, postal_code, website, industry, founded_date, description, social_links) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
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

    const newProfile = result.rows[0]

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Company profile created successfully",
        data: { company_id: newProfile.id, company_name: newProfile.company_name },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Company registration error:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Company registration failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// TypeScript types for database entities

export interface User {
  id: number
  email: string
  password: string
  full_name: string
  signup_type: "e"
  gender: "m" | "f" | "o"
  mobile_no: string
  is_mobile_verified: boolean
  is_email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface CompanyProfile {
  id: number
  owner_id: number
  company_name: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  website?: string
  logo_url?: string
  banner_url?: string
  industry: string
  founded_date?: Date
  description?: string
  social_links?: Record<string, string>
  created_at: Date
  updated_at: Date
}

// API request/response types
export interface RegisterUserRequest {
  email: string
  password: string
  full_name: string
  gender: "m" | "f" | "o"
  mobile_no: string
  signup_type: "e"
}

export interface LoginRequest {
  email: string
  password: string
}

export interface CompanyRegistrationRequest {
  company_name: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  website?: string
  industry: string
  founded_date?: string
  description?: string
  social_links?: Record<string, string>
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

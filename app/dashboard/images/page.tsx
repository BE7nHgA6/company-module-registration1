"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Container, Typography, Grid, Alert, CircularProgress, Box } from "@mui/material"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { ImageUploader } from "@/components/dashboard/ImageUploader"
import type { RootState } from "@/store/store"

export default function ImagesPage() {
  const router = useRouter()
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth)
  const [companyProfile, setCompanyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    fetchCompanyProfile()
  }, [isAuthenticated, router, token])

  const fetchCompanyProfile = async () => {
    try {
      const response = await fetch("/api/company/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (result.success) {
        setCompanyProfile(result.data)
      } else {
        setError("Company profile not found. Please complete your company registration first.")
      }
    } catch (err: any) {
      setError("Failed to load company profile")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUploadSuccess = (type: "logo" | "banner", imageUrl: string) => {
    setCompanyProfile((prev: any) => ({
      ...prev,
      [`${type}_url`]: imageUrl,
    }))
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Company Images
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload and manage your company logo and banner images. These will be displayed on your company profile.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ImageUploader
              type="logo"
              currentImageUrl={companyProfile?.logo_url}
              onUploadSuccess={(imageUrl) => handleImageUploadSuccess("logo", imageUrl)}
              description="Upload a square logo image that represents your company. This will be displayed in your profile and listings."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ImageUploader
              type="banner"
              currentImageUrl={companyProfile?.banner_url}
              onUploadSuccess={(imageUrl) => handleImageUploadSuccess("banner", imageUrl)}
              description="Upload a banner image for your company profile. This will be displayed as a header on your company page."
            />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  )
}

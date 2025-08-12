"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Container, Grid, Paper, Typography, Box, Chip, useMediaQuery, useTheme } from "@mui/material"
import { Verified, Warning } from "@mui/icons-material"
import type { RootState } from "@/store/store"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { CompanyProfileCard } from "@/components/dashboard/CompanyProfileCard"
import { UserProfileCard } from "@/components/dashboard/UserProfileCard"
import { QuickActions } from "@/components/dashboard/QuickActions"

export default function DashboardPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth)
  const [companyProfile, setCompanyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCompanyProfile(result.data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch company profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Welcome back, {user?.full_name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            Manage your company profile and account settings from your dashboard.
          </Typography>
        </Box>

        {/* Verification Status */}
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 4, bgcolor: "background.default" }}>
          <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
            Account Status
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" justifyContent={isMobile ? "center" : "flex-start"}>
            <Chip
              icon={user?.is_email_verified ? <Verified /> : <Warning />}
              label={`Email ${user?.is_email_verified ? "Verified" : "Not Verified"}`}
              color={user?.is_email_verified ? "success" : "warning"}
              variant={user?.is_email_verified ? "filled" : "outlined"}
              size={isMobile ? "small" : "medium"}
            />
            <Chip
              icon={user?.is_mobile_verified ? <Verified /> : <Warning />}
              label={`Mobile ${user?.is_mobile_verified ? "Verified" : "Not Verified"}`}
              color={user?.is_mobile_verified ? "success" : "warning"}
              variant={user?.is_mobile_verified ? "filled" : "outlined"}
              size={isMobile ? "small" : "medium"}
            />
            <Chip
              icon={companyProfile ? <Verified /> : <Warning />}
              label={`Company ${companyProfile ? "Registered" : "Not Registered"}`}
              color={companyProfile ? "success" : "warning"}
              variant={companyProfile ? "filled" : "outlined"}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Paper>

        <Grid container spacing={isMobile ? 2 : 4}>
          {/* User Profile Card */}
          <Grid item xs={12} md={6}>
            <UserProfileCard user={user} />
          </Grid>

          {/* Company Profile Card */}
          <Grid item xs={12} md={6}>
            <CompanyProfileCard companyProfile={companyProfile} loading={loading} />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <QuickActions companyProfile={companyProfile} />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  )
}

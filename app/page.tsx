"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Container, Typography, Box, Button, Paper } from "@mui/material"
import { Business, PersonAdd, Dashboard } from "@mui/icons-material"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Business sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Company Registration Portal
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Register your company and manage your business profile with ease
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", minWidth: 280 }}>
          <PersonAdd sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            New User
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Create your account and register your company
          </Typography>
          <Button variant="contained" size="large" fullWidth onClick={() => router.push("/register")}>
            Get Started
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, textAlign: "center", minWidth: 280 }}>
          <Dashboard sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Existing User
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Sign in to access your dashboard
          </Typography>
          <Button variant="outlined" size="large" fullWidth onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

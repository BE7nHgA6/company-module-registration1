"use client"

import { useRouter } from "next/navigation"
import { Box, Typography, Button, Paper } from "@mui/material"
import { CheckCircle, Dashboard } from "@mui/icons-material"

export function RegistrationComplete() {
  const router = useRouter()

  return (
    <Box textAlign="center">
      <Paper elevation={0} sx={{ p: 4, bgcolor: "success.light", color: "success.contrastText", mb: 3 }}>
        <CheckCircle sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Registration Complete!
        </Typography>
        <Typography variant="body1">
          Your company has been successfully registered. You can now access your dashboard to manage your profile.
        </Typography>
      </Paper>

      <Button variant="contained" size="large" startIcon={<Dashboard />} onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </Button>
    </Box>
  )
}

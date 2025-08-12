"use client"

import { useRouter } from "next/navigation"
import { Paper, Typography, Box, Button, Grid } from "@mui/material"
import { Business, Person, CloudUpload, Security } from "@mui/icons-material"

interface QuickActionsProps {
  companyProfile: any
}

export function QuickActions({ companyProfile }: QuickActionsProps) {
  const router = useRouter()

  const actions = [
    {
      title: "Company Profile",
      description: companyProfile ? "Update company information" : "Complete company registration",
      icon: <Business />,
      action: () => router.push(companyProfile ? "/dashboard/company" : "/register"),
      color: "primary" as const,
    },
    {
      title: "User Settings",
      description: "Manage your account settings",
      icon: <Person />,
      action: () => router.push("/dashboard/profile"),
      color: "secondary" as const,
    },
    {
      title: "Upload Images",
      description: "Add company logo and banner",
      icon: <CloudUpload />,
      action: () => router.push("/dashboard/images"),
      color: "success" as const,
      disabled: !companyProfile,
    },
    {
      title: "Security",
      description: "Manage password and security",
      icon: <Security />,
      action: () => router.push("/dashboard/security"),
      color: "warning" as const,
    },
  ]

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Button
              fullWidth
              variant="outlined"
              color={action.color}
              disabled={action.disabled}
              onClick={action.action}
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box sx={{ mb: 1 }}>{action.icon}</Box>
              <Typography variant="subtitle2" gutterBottom>
                {action.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {action.description}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

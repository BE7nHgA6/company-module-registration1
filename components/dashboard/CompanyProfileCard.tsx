"use client"

import { useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Grid,
  MenuItem,
  CircularProgress,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Business, Edit, Add, Language, LocationOn } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import type { RootState } from "@/store/store"

interface CompanyProfileCardProps {
  companyProfile: any
  loading: boolean
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Media & Entertainment",
  "Transportation",
  "Other",
]

export function CompanyProfileCard({ companyProfile, loading }: CompanyProfileCardProps) {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { token } = useSelector((state: RootState) => state.auth)
  const [editOpen, setEditOpen] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleEditOpen = () => {
    if (companyProfile) {
      reset({
        company_name: companyProfile.company_name || "",
        address: companyProfile.address || "",
        city: companyProfile.city || "",
        state: companyProfile.state || "",
        country: companyProfile.country || "",
        postal_code: companyProfile.postal_code || "",
        website: companyProfile.website || "",
        industry: companyProfile.industry || "",
        description: companyProfile.description || "",
      })
    }
    setEditOpen(true)
  }

  const handleEditClose = () => {
    setEditOpen(false)
  }

  const onSubmit = async (data: any) => {
    setUpdateLoading(true)
    try {
      const response = await fetch("/api/company/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Company profile updated successfully!")
        setEditOpen(false)
        window.location.reload() // Refresh to show updated data
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to update company profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{ p: { xs: 2, sm: 3 }, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Paper>
    )
  }

  if (!companyProfile) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
        <Box textAlign="center">
          <Business sx={{ fontSize: { xs: 48, sm: 64 }, color: "text.secondary", mb: 2 }} />
          <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
            No Company Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} sx={{ px: { xs: 1, sm: 0 } }}>
            Complete your company registration to access all features.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push("/register")}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
          >
            Register Company
          </Button>
        </Box>
      </Paper>
    )
  }

  return (
    <>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
        {companyProfile.banner_url && (
          <Box
            sx={{
              width: "100%",
              height: { xs: 80, sm: 120 },
              backgroundImage: `url(${companyProfile.banner_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 1,
              mb: 2,
            }}
          />
        )}

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
          <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
            Company Profile
          </Typography>
          <Button startIcon={<Edit />} onClick={handleEditOpen} size="small" variant={isMobile ? "outlined" : "text"}>
            Edit
          </Button>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          mb={3}
          flexDirection={isMobile ? "column" : "row"}
          textAlign={isMobile ? "center" : "left"}
        >
          <Avatar
            src={companyProfile.logo_url}
            sx={{
              width: { xs: 48, sm: 64 },
              height: { xs: 48, sm: 64 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1, sm: 0 },
              bgcolor: "primary.main",
            }}
          >
            <Business sx={{ fontSize: { xs: 24, sm: 32 } }} />
          </Avatar>
          <Box>
            <Typography variant={isMobile ? "body1" : "h6"}>{companyProfile.company_name}</Typography>
            <Chip label={companyProfile.industry} size="small" sx={{ mt: 1 }} />
          </Box>
        </Box>

        <Box mb={2}>
          <Box display="flex" alignItems="center" mb={1} flexWrap="wrap">
            <LocationOn sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
              {companyProfile.city}, {companyProfile.state}, {companyProfile.country}
            </Typography>
          </Box>
          {companyProfile.website && (
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Language sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              <Typography
                variant="body2"
                color="primary"
                component="a"
                href={companyProfile.website}
                target="_blank"
                sx={{ wordBreak: "break-all" }}
              >
                {companyProfile.website}
              </Typography>
            </Box>
          )}
        </Box>

        {companyProfile.description && (
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
            {companyProfile.description}
          </Typography>
        )}
      </Paper>

      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle>Edit Company Profile</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  {...register("company_name", {
                    required: "Company name is required",
                  })}
                  error={!!errors.company_name}
                  helperText={errors.company_name?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={isMobile ? 2 : 3}
                  {...register("address", {
                    required: "Address is required",
                  })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  {...register("city", {
                    required: "City is required",
                  })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  {...register("state", {
                    required: "State is required",
                  })}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  {...register("country", {
                    required: "Country is required",
                  })}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  {...register("postal_code", {
                    required: "Postal code is required",
                  })}
                  error={!!errors.postal_code}
                  helperText={errors.postal_code?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Website (Optional)" type="url" {...register("website")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Industry"
                  {...register("industry", {
                    required: "Industry is required",
                  })}
                  error={!!errors.industry}
                  helperText={errors.industry?.message}
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Description (Optional)"
                  multiline
                  rows={isMobile ? 3 : 4}
                  {...register("description")}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ p: { xs: 2, sm: 3 }, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 1 : 0 }}
          >
            <Button onClick={handleEditClose} fullWidth={isMobile}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={updateLoading} fullWidth={isMobile}>
              {updateLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

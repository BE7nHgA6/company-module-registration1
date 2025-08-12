"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { TextField, Button, Box, Typography, Alert, CircularProgress, Grid, MenuItem } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import type { CompanyRegistrationRequest } from "@/types/database"

interface CompanyRegistrationStepProps {
  onNext: () => void
  onBack: () => void
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

export function CompanyRegistrationStep({ onNext, onBack }: CompanyRegistrationStepProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [foundedDate, setFoundedDate] = useState<Date | null>(null)
  const { token } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyRegistrationRequest>()

  const onSubmit = async (data: CompanyRegistrationRequest) => {
    setLoading(true)
    setError("")

    try {
      const companyData = {
        ...data,
        founded_date: foundedDate?.toISOString().split("T")[0],
      }

      const response = await fetch("/api/company/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Company registered successfully!")
        onNext()
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError("Company registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Company Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please provide your company details to complete the registration.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
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
                rows={3}
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
              <TextField
                fullWidth
                label="Website (Optional)"
                type="url"
                {...register("website")}
                error={!!errors.website}
                helperText={errors.website?.message}
              />
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

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Founded Date (Optional)"
                value={foundedDate}
                onChange={setFoundedDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Description (Optional)"
                multiline
                rows={4}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onBack} sx={{ flex: 1 }}>
              Back
            </Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ flex: 1 }}>
              {loading ? <CircularProgress size={24} /> : "Complete Registration"}
            </Button>
          </Box>
        </form>
      </Box>
    </LocalizationProvider>
  )
}

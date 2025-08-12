"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/material.css"
import { toast } from "react-toastify"
import type { RegisterUserRequest } from "@/types/database"

interface UserRegistrationStepProps {
  onNext: (data: any) => void
}

export function UserRegistrationStep({ onNext }: UserRegistrationStepProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterUserRequest>()

  const password = watch("password")

  const onSubmit = async (data: RegisterUserRequest) => {
    if (!phoneNumber) {
      setError("Mobile number is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const registrationData = {
        ...data,
        mobile_no: `+${phoneNumber}`,
        signup_type: "e" as const,
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Registration successful! Please verify your mobile number.")
        onNext({ ...registrationData, user_id: result.data.user_id })
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 0 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              size={isMobile ? "small" : "medium"}
              {...register("full_name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              size={isMobile ? "small" : "medium"}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <FormLabel component="legend" sx={{ mb: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              Mobile Number
            </FormLabel>
            <PhoneInput
              country={"in"}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputStyle={{
                width: "100%",
                height: isMobile ? "40px" : "56px",
                fontSize: isMobile ? "14px" : "16px",
              }}
              containerStyle={{
                width: "100%",
              }}
              buttonStyle={{
                height: isMobile ? "40px" : "56px",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Gender
              </FormLabel>
              <RadioGroup row={!isMobile} sx={{ justifyContent: isMobile ? "flex-start" : "space-around" }}>
                <FormControlLabel
                  value="m"
                  control={
                    <Radio
                      {...register("gender", { required: "Gender is required" })}
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Male"
                />
                <FormControlLabel
                  value="f"
                  control={
                    <Radio
                      {...register("gender", { required: "Gender is required" })}
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Female"
                />
                <FormControlLabel
                  value="o"
                  control={
                    <Radio
                      {...register("gender", { required: "Gender is required" })}
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label="Other"
                />
              </RadioGroup>
              {errors.gender && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.gender.message}
                </Alert>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              size={isMobile ? "small" : "medium"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              size={isMobile ? "small" : "medium"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size={isMobile ? "medium" : "large"}
              disabled={loading}
              sx={{ mt: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}
            >
              {loading ? <CircularProgress size={24} /> : "Continue"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material"
import { toast } from "react-toastify"

interface MobileVerificationStepProps {
  onNext: () => void
  onBack: () => void
  userData: any
}

export function MobileVerificationStep({ onNext, onBack, userData }: MobileVerificationStepProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: { otp: string }) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile_no: userData.mobile_no,
          otp: data.otp,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Mobile number verified successfully!")
        onNext()
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Verify Your Mobile Number
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We've sent a 6-digit OTP to {userData?.mobile_no}. Please enter it below to verify your mobile number.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Enter OTP"
          margin="normal"
          inputProps={{ maxLength: 6 }}
          {...register("otp", {
            required: "OTP is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Please enter a valid 6-digit OTP",
            },
          })}
          error={!!errors.otp}
          helperText={errors.otp?.message}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={onBack} sx={{ flex: 1 }}>
            Back
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ flex: 1 }}>
            {loading ? <CircularProgress size={24} /> : "Verify"}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

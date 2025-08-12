"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { Container, Paper, TextField, Button, Typography, Box, Link, Alert, CircularProgress } from "@mui/material"
import { Business } from "@mui/icons-material"
import { toast } from "react-toastify"
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice"
import type { LoginRequest } from "@/types/database"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>()

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true)
    setError("")
    dispatch(loginStart())

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        dispatch(loginSuccess(result.data))
        toast.success("Login successful!")
        router.push("/dashboard")
      } else {
        setError(result.message)
        dispatch(loginFailure(result.message))
      }
    } catch (err: any) {
      const errorMessage = "Login failed. Please try again."
      setError(errorMessage)
      dispatch(loginFailure(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <Business sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Please sign in to your account.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            margin="normal"
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

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push("/register")}
              sx={{ cursor: "pointer" }}
            >
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

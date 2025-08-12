"use client"

import { useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import { Person, Edit, Verified, Warning } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "@/store/authSlice"
import { toast } from "react-toastify"
import type { RootState } from "@/store/store"

interface UserProfileCardProps {
  user: any
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const dispatch = useDispatch()
  const { token } = useSelector((state: RootState) => state.auth)
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || "",
      gender: user?.gender || "m",
    },
  })

  const handleEditOpen = () => {
    reset({
      full_name: user?.full_name || "",
      gender: user?.gender || "m",
    })
    setEditOpen(true)
  }

  const handleEditClose = () => {
    setEditOpen(false)
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        dispatch(updateUser(data))
        toast.success("Profile updated successfully!")
        setEditOpen(false)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
        <Box display="flex" alignItems="center" justifyContent="between" mb={3}>
          <Typography variant="h6" gutterBottom>
            User Profile
          </Typography>
          <Button startIcon={<Edit />} onClick={handleEditOpen} size="small">
            Edit
          </Button>
        </Box>

        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: "primary.main" }}>
            <Person sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h6">{user?.full_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.mobile_no}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            icon={user?.is_email_verified ? <Verified /> : <Warning />}
            label="Email"
            color={user?.is_email_verified ? "success" : "warning"}
            size="small"
          />
          <Chip
            icon={user?.is_mobile_verified ? <Verified /> : <Warning />}
            label="Mobile"
            color={user?.is_mobile_verified ? "success" : "warning"}
            size="small"
          />
        </Box>
      </Paper>

      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User Profile</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              {...register("full_name", {
                required: "Full name is required",
              })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />

            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup row>
                <FormControlLabel value="m" control={<Radio {...register("gender")} />} label="Male" />
                <FormControlLabel value="f" control={<Radio {...register("gender")} />} label="Female" />
                <FormControlLabel value="o" control={<Radio {...register("gender")} />} label="Other" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

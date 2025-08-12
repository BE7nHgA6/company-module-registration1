"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Box, Button, Typography, Paper, CircularProgress, Alert, Avatar, IconButton } from "@mui/material"
import { CloudUpload, Edit } from "@mui/icons-material"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

interface ImageUploaderProps {
  type: "logo" | "banner"
  currentImageUrl?: string
  onUploadSuccess: (imageUrl: string) => void
  maxSize?: number
  aspectRatio?: string
  description?: string
}

export function ImageUploader({
  type,
  currentImageUrl,
  onUploadSuccess,
  maxSize = type === "logo" ? 5 : 10,
  aspectRatio = type === "logo" ? "1:1" : "16:9",
  description,
}: ImageUploaderProps) {
  const { token } = useSelector((state: RootState) => state.auth)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append(type, file)

      const response = await fetch(`/api/company/upload-${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`${type === "logo" ? "Logo" : "Banner"} uploaded successfully!`)
        onUploadSuccess(result.data[`${type}_url`])
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const renderImagePreview = () => {
    if (type === "logo") {
      return (
        <Box position="relative" display="inline-block">
          <Avatar
            src={currentImageUrl}
            sx={{
              width: 120,
              height: 120,
              bgcolor: "grey.200",
              fontSize: "2rem",
            }}
          >
            {!currentImageUrl && "LOGO"}
          </Avatar>
          {currentImageUrl && (
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
              onClick={handleFileSelect}
            >
              <Edit fontSize="small" />
            </IconButton>
          )}
        </Box>
      )
    }

    return (
      <Box
        sx={{
          width: "100%",
          height: 200,
          bgcolor: "grey.100",
          backgroundImage: currentImageUrl ? `url(${currentImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 1,
        }}
      >
        {!currentImageUrl && (
          <Typography variant="h6" color="text.secondary">
            BANNER
          </Typography>
        )}
        {currentImageUrl && (
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
            onClick={handleFileSelect}
          >
            <Edit />
          </IconButton>
        )}
      </Box>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {type === "logo" ? "Company Logo" : "Company Banner"}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <Box textAlign="center" mb={3}>
        {renderImagePreview()}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box textAlign="center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <Button
          variant={currentImageUrl ? "outlined" : "contained"}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          onClick={handleFileSelect}
          disabled={uploading}
          fullWidth
        >
          {uploading
            ? "Uploading..."
            : currentImageUrl
              ? `Change ${type === "logo" ? "Logo" : "Banner"}`
              : `Upload ${type === "logo" ? "Logo" : "Banner"}`}
        </Button>

        <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
          Max size: {maxSize}MB • Recommended ratio: {aspectRatio}
        </Typography>
      </Box>
    </Paper>
  )
}

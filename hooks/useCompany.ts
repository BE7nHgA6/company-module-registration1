import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { companyAPI } from "@/services/api"
import { toast } from "react-toastify"

export const useCompany = () => {
  const queryClient = useQueryClient()

  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["company-profile"],
    queryFn: () => companyAPI.getProfile().then((res) => res.data.data),
    retry: false,
  })

  const registerMutation = useMutation({
    mutationFn: companyAPI.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] })
      toast.success("Company registered successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed")
    },
  })

  const updateMutation = useMutation({
    mutationFn: companyAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] })
      toast.success("Company profile updated successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed")
    },
  })

  const uploadLogoMutation = useMutation({
    mutationFn: companyAPI.uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] })
      toast.success("Logo uploaded successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Upload failed")
    },
  })

  const uploadBannerMutation = useMutation({
    mutationFn: companyAPI.uploadBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] })
      toast.success("Banner uploaded successfully!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Upload failed")
    },
  })

  return {
    company,
    isLoading,
    error,
    registerCompany: registerMutation.mutate,
    updateCompany: updateMutation.mutate,
    uploadLogo: uploadLogoMutation.mutate,
    uploadBanner: uploadBannerMutation.mutate,
    isRegistering: registerMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUploadingLogo: uploadLogoMutation.isPending,
    isUploadingBanner: uploadBannerMutation.isPending,
  }
}

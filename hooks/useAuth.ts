"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/store/store"
import { logout } from "@/store/authSlice"

export const useAuth = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const isAuthenticated = !!token && !!user

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    logout: handleLogout,
  }
}

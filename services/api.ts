import axios from "axios"
import { store } from "@/store/store"

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch({ type: "auth/logout" })
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  verifyMobile: (data: any) => api.post("/auth/verify-mobile", data),
}

export const companyAPI = {
  register: (data: any) => api.post("/company/register", data),
  getProfile: () => api.get("/company/profile"),
  updateProfile: (data: any) => api.put("/company/profile", data),
  uploadLogo: (formData: FormData) => api.post("/company/upload-logo", formData),
  uploadBanner: (formData: FormData) => api.post("/company/upload-banner", formData),
}

export default api

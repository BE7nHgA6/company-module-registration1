import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface SocialLinks {
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
}

interface CompanyProfile {
  id: number
  ownerId: number
  companyName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  website?: string
  logoUrl?: string
  bannerUrl?: string
  industry: string
  foundedDate?: string
  description?: string
  socialLinks?: SocialLinks
}

interface CompanyState {
  profile: CompanyProfile | null
  loading: boolean
}

const initialState: CompanyState = {
  profile: null,
  loading: false,
}

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setCompanyProfile: (state, action: PayloadAction<CompanyProfile>) => {
      state.profile = action.payload
    },
    updateCompanyProfile: (state, action: PayloadAction<Partial<CompanyProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    clearCompanyProfile: (state) => {
      state.profile = null
    },
  },
})

export const { setLoading, setCompanyProfile, updateCompanyProfile, clearCompanyProfile } = companySlice.actions
export default companySlice.reducer

"use client"

import { useState } from "react"
import { Container, Paper, Typography, Box, Stepper, Step, StepLabel, useMediaQuery, useTheme } from "@mui/material"
import { Business } from "@mui/icons-material"
import { UserRegistrationStep } from "@/components/registration/UserRegistrationStep"
import { MobileVerificationStep } from "@/components/registration/MobileVerificationStep"
import { CompanyRegistrationStep } from "@/components/registration/CompanyRegistrationStep"
import { RegistrationComplete } from "@/components/registration/RegistrationComplete"

const steps = ["User Details", "Mobile Verification", "Company Details", "Complete"]

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleNext = (data?: any) => {
    if (data) {
      setUserData({ ...userData, ...data })
    }
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserRegistrationStep onNext={handleNext} />
      case 1:
        return <MobileVerificationStep onNext={handleNext} onBack={handleBack} userData={userData} />
      case 2:
        return <CompanyRegistrationStep onNext={handleNext} onBack={handleBack} />
      case 3:
        return <RegistrationComplete />
      default:
        return null
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Box textAlign="center" mb={4}>
          <Business sx={{ fontSize: { xs: 36, sm: 48 }, color: "primary.main", mb: 2 }} />
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
            Company Registration
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ px: { xs: 1, sm: 0 } }}>
            Complete the registration process to set up your company profile
          </Typography>
        </Box>

        <Stepper
          activeStep={activeStep}
          sx={{ mb: 4 }}
          orientation={isMobile ? "vertical" : "horizontal"}
          alternativeLabel={!isMobile}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </Paper>
    </Container>
  )
}

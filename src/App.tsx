import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import {
  CheckEmailPage, ConfirmPage, ForgotPasswordPage, LoginPage, RequireAuth, ResetPasswordPage, SignUpPage,
} from './pages/auth'
import { DashboardPage, TripSummaryPage } from './pages/Dashboard'
import { HomePage } from './pages/Home'
import { ComingSoonPage, NotFoundPage } from './pages/misc'
import { NewTripPage, WizardPage } from './pages/Wizard'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="check-email" element={<CheckEmailPage />} />
        <Route path="auth/confirm" element={<ConfirmPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="trips/new" element={<RequireAuth><NewTripPage /></RequireAuth>} />
        <Route path="trips/:id" element={<RequireAuth><TripSummaryPage /></RequireAuth>} />
        <Route path="trips/:id/edit" element={<RequireAuth><WizardPage /></RequireAuth>} />
        <Route path="guides" element={<ComingSoonPage kind="guides" />} />
        <Route path="ai" element={<ComingSoonPage kind="ai" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import CreditCardsPage from "./pages/CreditCardsPage.jsx";
import BillPaymentsPage from "./pages/BillPaymentsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import { AdminAuthProvider } from "./admin/AdminAuthContext.jsx";
import AdminRoute from "./admin/AdminRoute.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminLoginPage from "./admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./admin/AdminDashboardPage.jsx";
import AdminFeedbackPage from "./admin/AdminFeedbackPage.jsx";
import AdminUsersPage from "./admin/AdminUsersPage.jsx";
import AdminFlagsPage from "./admin/AdminFlagsPage.jsx";
import AdminAuditPage from "./admin/AdminAuditPage.jsx";
import AdminProfilePage from "./admin/AdminProfilePage.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/app" replace /> : <LandingPage />}
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/app" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/app" replace /> : <RegisterPage />}
      />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />

      <Route
        path="/admin/login"
        element={
          <AdminAuthProvider>
            <AdminLoginPage />
          </AdminAuthProvider>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminAuthProvider>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </AdminAuthProvider>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="feedback" element={<AdminFeedbackPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="flags" element={<AdminFlagsPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/app" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/credit-cards" element={<CreditCardsPage />} />
        <Route path="/bill-payments" element={<BillPaymentsPage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/feedback" element={<FeedbackPage embedded />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/app" : "/"} replace />} />
    </Routes>
  );
}
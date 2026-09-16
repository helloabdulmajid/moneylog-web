import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";

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
        <Route path="/payments" element={<PaymentPage />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/app" : "/"} replace />} />
    </Routes>
  );
}
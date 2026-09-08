import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/app/useAuth';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import UsersPage from '@/pages/UsersPage';
import ProductsPage from '@/pages/ProductsPage';
import InvoicesListPage from '@/pages/InvoicesListPage';
import InvoiceFormPage from '@/pages/InvoiceFormPage';
import TaxesPage from '@/pages/TaxesPage';
import PaymentMethodsPage from '@/pages/PaymentMethodsPage';
import ChannelsPage from '@/pages/ChannelsPage';
import CompanyPage from '@/pages/CompanyPage';
import AppLayout from '@/shared/components/Layout-Component';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/facturas" element={<InvoicesListPage />} />
          <Route path="/facturas/nueva" element={<InvoiceFormPage />} />
          <Route path="/impuestos" element={<TaxesPage />} />
          <Route path="/metodos-pago" element={<PaymentMethodsPage />} />
          <Route path="/canales" element={<ChannelsPage />} />
          <Route path="/empresa" element={<CompanyPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

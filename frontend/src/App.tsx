import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { GuestOnly, RequireAuth, RequireCompany } from './auth/guards'
import { AppShell } from './components/AppShell'
import { AccountsPage } from './pages/AccountsPage'
import { ChannelsPage } from './pages/ChannelsPage'
import { CompaniesPage } from './pages/CompaniesPage'
import { CurrenciesPage } from './pages/CurrenciesPage'
import { CustomersPage } from './pages/CustomersPage'
import { DashboardPage } from './pages/DashboardPage'
import { InvoiceFormPage } from './pages/InvoiceFormPage'
import { InvoicesListPage } from './pages/InvoicesListPage'
import { LoginPage } from './pages/LoginPage'
import { MethodsPage } from './pages/MethodsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductsPage } from './pages/ProductsPage'
import { RegisterPage } from './pages/RegisterPage'
import { SelectCompanyPage } from './pages/SelectCompanyPage'
import { TaxesPage } from './pages/TaxesPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/select-company" element={<SelectCompanyPage />} />
              <Route element={<RequireCompany />}>
                <Route element={<AppShell />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/invoices" element={<InvoicesListPage />} />
                  <Route path="/invoices/new" element={<InvoiceFormPage />} />
                  <Route path="/invoices/:id" element={<InvoiceFormPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/taxes" element={<TaxesPage />} />
                  <Route path="/methods-payments" element={<MethodsPage />} />
                  <Route path="/accounts" element={<AccountsPage />} />
                  <Route path="/channels" element={<ChannelsPage />} />
                  <Route path="/catalog/currencies" element={<CurrenciesPage />} />
                  <Route path="/companies" element={<CompaniesPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

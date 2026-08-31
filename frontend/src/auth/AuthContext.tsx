import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, setNeedsCompanyHandler, setUnauthorizedHandler } from '../api/client'
import { authApi, companiesApi } from '../api/resources'
import type { Company, User } from '../api/types'
import { storage } from '../lib/storage'

type AuthContextValue = {
  user: User | null
  company: Company | null
  companies: Company[]
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, confirmation: string) => Promise<void>
  logout: () => Promise<void>
  switchCompany: (id: number) => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => storage.getToken())
  const [authError, setAuthError] = useState<string | null>(null)

  const meQuery = useQuery({
    queryKey: ['auth', 'me', token],
    enabled: Boolean(token),
    retry: false,
    queryFn: async () => {
      const res = await authApi.me()
      const user = res.data
      if (user.current_company_id) storage.setCompanyId(user.current_company_id)
      return user
    },
  })

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null)
      storage.clear()
      queryClient.clear()
      navigate('/login', { replace: true })
    })
    setNeedsCompanyHandler(() => {
      navigate('/select-company', { replace: true })
    })
    return () => {
      setUnauthorizedHandler(null)
      setNeedsCompanyHandler(null)
    }
  }, [navigate, queryClient])

  const persistSession = (nextToken: string, user: User) => {
    storage.setToken(nextToken)
    if (user.current_company_id) storage.setCompanyId(user.current_company_id)
    else if (!user.companies?.length) storage.setCompanyId(null)
    setToken(nextToken)
    queryClient.setQueryData(['auth', 'me', nextToken], user)
  }

  const value = useMemo<AuthContextValue>(() => {
    const user = meQuery.data ?? null
    const companies = user?.companies ?? []
    const currentId = user?.current_company_id ?? (storage.getCompanyId() ? Number(storage.getCompanyId()) : null)
    const company = companies.find((item) => item.id === currentId) ?? companies[0] ?? null

    return {
      user,
      company,
      companies,
      token,
      loading: Boolean(token) && meQuery.isLoading,
      error: authError ?? (meQuery.error instanceof ApiError ? meQuery.error.message : null),
      async login(email, password) {
        setAuthError(null)
        try {
          const res = await authApi.login(email, password)
          persistSession(res.data.token, res.data.user)
          if (!res.data.user.companies?.length) navigate('/select-company', { replace: true })
          else navigate('/', { replace: true })
        } catch (error) {
          setAuthError(error instanceof ApiError ? error.message : 'No se pudo iniciar sesión.')
          throw error
        }
      },
      async register(name, email, password, confirmation) {
        setAuthError(null)
        try {
          const res = await authApi.register(name, email, password, confirmation)
          persistSession(res.data.token, res.data.user)
          navigate('/select-company', { replace: true })
        } catch (error) {
          setAuthError(error instanceof ApiError ? error.message : 'No se pudo crear la cuenta.')
          throw error
        }
      },
      async logout() {
        try {
          if (storage.getToken()) await authApi.logout()
        } catch {
          // still clear locally
        }
        storage.clear()
        setToken(null)
        queryClient.clear()
        navigate('/login', { replace: true })
      },
      async switchCompany(id: number) {
        const res = await companiesApi.switch(id)
        storage.setCompanyId(res.data.id)
        await queryClient.invalidateQueries()
        await meQuery.refetch()
      },
      async refresh() {
        await meQuery.refetch()
      },
    }
  }, [authError, meQuery, navigate, queryClient, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

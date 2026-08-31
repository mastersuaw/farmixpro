const TOKEN_KEY = 'farmixpro.token'
const COMPANY_KEY = 'farmixpro.companyId'

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  setToken(token: string | null) {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  },
  getCompanyId(): string | null {
    return localStorage.getItem(COMPANY_KEY)
  },
  setCompanyId(id: number | string | null) {
    if (id === null || id === undefined || id === '') localStorage.removeItem(COMPANY_KEY)
    else localStorage.setItem(COMPANY_KEY, String(id))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(COMPANY_KEY)
  },
}

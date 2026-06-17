"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import type { MemsystUser } from "@/types"
import type { IAuthService } from "@/lib/services"
import { getAuthService } from "@/lib/services"

interface AuthContextValue {
  user: MemsystUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<MemsystUser>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MemsystUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authService, setAuthService] = useState<IAuthService | null>(null)

  useEffect(() => {
    getAuthService().then((svc) => {
      setAuthService(svc)
      svc.getCurrentUser().then((u) => {
        setUser(u)
        setIsLoading(false)
      })
      svc.onAuthStateChanged((u) => setUser(u))
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!authService) throw new Error("Auth service not initialized")
    const u = await authService.login(email, password)
    return u
  }, [authService])

  const logout = useCallback(async () => {
    if (!authService) return
    await authService.logout()
    setUser(null)
  }, [authService])

  const refreshUser = useCallback(async () => {
    if (!authService) return
    const u = await authService.getCurrentUser()
    setUser(u)
  }, [authService])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

'use client'

import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

interface SignUpData {
  email: string
  password: string
  fullName?: string
}

interface SignInData {
  email: string
  password: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error
      })
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        }))

        // Redirect based on auth state
        if (event === 'SIGNED_IN') {
          router.push(ROUTES.DASHBOARD)
        } else if (event === 'SIGNED_OUT') {
          router.push(ROUTES.HOME)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signUp = async ({ email, password, fullName }: SignUpData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error }))
      return { data: null, error }
    }

    return { data, error: null }
  }

  const signIn = async ({ email, password }: SignInData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error }))
      return { data: null, error }
    }

    return { data, error: null }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error }))
      return { error }
    }

    return { error: null }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    return { error }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })

    return { error }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!authState.session
  }
}

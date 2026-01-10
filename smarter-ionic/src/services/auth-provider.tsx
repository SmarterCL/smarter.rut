import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useSupabase } from './supabase';
import SharedAuthService from '../../../shared/services/auth';

interface AuthContextType {
  authService: SharedAuthService | null;
  user: any | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithMagicLink: (email: string) => Promise<any>;
  signInWithOAuth: (provider: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { supabase } = useSupabase();
  const [authService, setAuthService] = useState<SharedAuthService | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      const service = new SharedAuthService(supabase);
      setAuthService(service);

      // Get initial user state
      const getInitialSession = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          setUser(session?.user || null);
        } catch (error) {
          console.error('Error getting initial session:', error);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();

      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Handle case when supabase is not initialized (offline mode)
      setLoading(false);
    }
  }, [supabase]);

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signInWithPassword = async (email: string, password: string) => {
    if (!authService) {
      throw new Error('AuthService not initialized');
    }
    return await authService.signInWithPassword(email, password);
  };

  const signInWithMagicLink = async (email: string) => {
    if (!authService) {
      throw new Error('AuthService not initialized');
    }
    return await authService.signInWithMagicLink(email);
  };

  const signInWithOAuth = async (provider: string) => {
    if (!authService) {
      throw new Error('AuthService not initialized');
    }
    return await authService.signInWithOAuth(provider);
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: any) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user?.id);

    if (error) {
      throw error;
    }

    return data;
  };

  const value = {
    authService,
    user,
    session,
    loading,
    signUp,
    signInWithPassword,
    signInWithMagicLink,
    signInWithOAuth,
    signOut,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
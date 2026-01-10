import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SupabaseContext {
  supabase: SupabaseClient | null;
}

const supabaseContext = createContext<SupabaseContext>({ supabase: null });

export const useSupabase = () => {
  const context = useContext(supabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    // Use the same Supabase configuration as the web app
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project.supabase.co')) {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);
    } else {
      console.warn('Supabase configuration not found or invalid. Running in offline mode.');
      // Create a mock client for local development
      const mockClient: any = {
        auth: {
          signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
          signInWithOAuth: () => {
            console.log('OAuth sign in would redirect to provider');
            return Promise.resolve({ error: null, data: null });
          },
          signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
          signOut: () => Promise.resolve({ error: null }),
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: (callback: any) => {
            // Simulate auth state change
            setTimeout(() => callback('INITIAL_SESSION', null), 0);
            return { data: { subscription: { unsubscribe: () => {} } } };
          },
          resetPasswordForEmail: () => Promise.resolve({ error: null }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null })
        },
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          update: () => Promise.resolve({ error: null }),
          eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) })
        })
      };
      setSupabase(mockClient);
    }
  }, []);

  return (
    <supabaseContext.Provider value={{ supabase }}>
      {children}
    </supabaseContext.Provider>
  );
};
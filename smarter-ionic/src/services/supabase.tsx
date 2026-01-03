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
    // Use local Supabase configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.xAHgHvOSPV099I8E2q4f406_T9avCzGm6B2p44J4Wt8';
    
    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);
    }
  }, []);

  return (
    <supabaseContext.Provider value={{ supabase }}>
      {children}
    </supabaseContext.Provider>
  );
};
import { useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

function Logout() {
  useEffect(() => {
    supabase.auth.signOut();
    localStorage.removeItem('__mtp__id');
    localStorage.removeItem('__mtp__ud');
    window.location.replace('/auth/login');
  }, []);

  return <p></p>;
}

export default Logout;

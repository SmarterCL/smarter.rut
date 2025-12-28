import { useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

function Logout() {
  useEffect(() => {
    supabase.auth.signOut();
    localStorage.removeItem('__sbot__id');
    localStorage.removeItem('__sbot__ud');
    window.location.replace('/login');
  }, []);

  return <p></p>;
}

export default Logout;

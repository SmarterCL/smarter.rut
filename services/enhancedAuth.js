import { createClient } from '@supabase/supabase-js';
import SharedAuthService from '../shared/services/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (console.warn('Supabase URL or Anon Key missing'), null);

export const supabaseService = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : (console.warn('Supabase URL or Service Key missing'), null);

// Servicio de autenticación mejorado combinando funcionalidades de ambos proyectos
class EnhancedAuthService extends SharedAuthService {
  constructor() {
    super(supabase);
    this.supabase = supabase;
    this.supabaseService = supabaseService;
  }

  // Método de login con enlace mágico
  async signInWithMagicLink(email) {
    try {
      // Usar el origen actual como URL de redirección
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl // Redirigir de vuelta al origen actual
        }
      });

      if (error) {
        throw error;
      }

      // Registrar evento de login
      await this.logEvent('user_signin_attempt', { email });

      return {
        success: true,
        data: { message: 'Enlace mágico enviado. ¡Revisa tu email!' }
      };
    } catch (error) {
      await this.logEvent('user_signin_error', {
        email,
        error: error.message
      });

      return {
        success: false,
        error: error.error_description || error.message
      };
    }
  }

  // Método de login con OAuth
  async signInWithOAuth(provider, redirectUrl = null) {
    try {
      const finalRedirectUrl = redirectUrl || `${window.location.origin}/dashboard`;
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: finalRedirectUrl
        }
      });

      if (error) {
        return { error, data: null };
      }

      return { error: null, data };
    } catch (error) {
      return { error: error.message || 'Falló el inicio de sesión OAuth', data: null };
    }
  }

  // Método de login tradicional (del proyecto Next.js)
  async signInWithPassword(email, password) {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      // Si el login es exitoso, buscamos los datos extendidos
      const { data: userData, error: userError } = await this.supabase
        .from('accounts')
        .select('*')
        .eq('email', email)
        .eq('deleted', false)
        .single();

      if (userData) {
        // Almacenar datos del usuario en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('__sbot__id', userData.id);
          localStorage.setItem(
            '__sbot__ud',
            JSON.stringify(Object.assign(userData, { password: '' }))
          );
        }

        return {
          success: true,
          data: { userData, redirectUrl: `/dashboard/${userData.type}` }
        };
      } else {
        return {
          success: false,
          error: 'No se encontraron datos de cuenta'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener perfil del usuario
  async getProfile(userId) {
    const currentUser = userId || (await this.getUser())?.id;
    if (!currentUser) return null;

    const { data, error } = await this.supabase
      .from('profiles') // Ajustar según la tabla real de perfiles
      .select('*')
      .eq('id', currentUser)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  }

  // Actualizar perfil del usuario
  async updateProfile(profile) {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const updateData = {
        ...profile,
        id: user.id,
        updated_at: new Date().toISOString(),
        email: user.email
      };

      const { error } = await this.supabase
        .from('profiles') // Ajustar según la tabla real de perfiles
        .upsert(updateData);

      if (error) {
        throw error;
      }

      await this.logEvent('profile_updated', {
        user_id: user.id,
        changes: Object.keys(profile)
      });

      return {
        success: true,
        data: { message: 'Perfil actualizado exitosamente' }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener usuario actual
  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  // Obtener sesión actual
  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        throw error;
      }

      const user = await this.getUser();
      await this.logEvent('user_signout', { user_id: user?.id });

      // Limpiar datos del localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('__sbot__id');
        localStorage.removeItem('__sbot__ud');
      }

      return {
        success: true,
        data: { message: 'Sesión cerrada exitosamente' }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Registrar eventos (funcionalidad MCP)
  async logEvent(eventType, payload = {}) {
    if (typeof window === 'undefined') return; // Solo en el cliente

    try {
      const user = await this.getUser();
      const session = await this.getSession();

      const eventData = {
        timestamp: new Date().toISOString(),
        event_type: eventType,
        user_id: user?.id || 'anonymous',
        session_id: session?.access_token || 'no-session',
        platform: 'web',
        app_version: '1.0.0', // Ajustar según la versión real
        ...payload
      };

      // En una implementación real, esto se enviaría al servidor MCP
      console.log('[MCP Event]', eventData);

      // Almacenar en Supabase para análisis
      await this.supabase
        .from('mcp_logs') // Ajustar según la tabla real de logs
        .insert([eventData]);
    } catch (error) {
      console.error('MCP Event Logging Error:', error);
    }
  }

  // Inicializar listener de estado de autenticación
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

// Exportar una instancia singleton del servicio
export const authService = new EnhancedAuthService();

// Función para obtener la URL del avatar
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  return `${supabaseUrl}/storage/v1/object/public/avatars/${avatarPath}`;
};
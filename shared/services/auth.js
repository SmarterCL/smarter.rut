// shared/services/auth.js
// Servicios de autenticación para Next.js
// Note: This file has been converted from TypeScript to JavaScript for compatibility

class SharedAuthService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  // Método de login con enlace mágico
  async signInWithMagicLink(email, redirectUrl = null) {
    try {
      // Usar el origen actual como URL de redirección si no se proporciona
      const finalRedirectUrl = redirectUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: finalRedirectUrl
        }
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: { message: 'Enlace mágico enviado. ¡Revisa tu email!' }
      };
    } catch (error) {
      return {
        success: false,
        error: error.error_description || error.message
      };
    }
  }

  // Método de login con OAuth
  async signInWithOAuth(provider, redirectUrl = null) {
    try {
      const finalRedirectUrl = redirectUrl || `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/dashboard`;

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

  // Método de login tradicional
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
        return {
          success: true,
          data: { userData }
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
      .from('profiles')
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
        .from('profiles')
        .upsert(updateData);

      if (error) {
        throw error;
      }

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

  // Inicializar listener de estado de autenticación
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

export default SharedAuthService;
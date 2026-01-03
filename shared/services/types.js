// shared/services/types.js
// Tipos comunes para ambos proyectos

// Tipos de usuario
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended'
};

// Tipos de autenticación
export const AuthMethod = {
  PASSWORD: 'password',
  MAGIC_LINK: 'magic-link',
  GOOGLE: 'google',
  GITHUB: 'github',
  FACEBOOK: 'facebook',
  APPLE: 'apple'
};

// Tipos de eventos MCP
export const MCPEventType = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_SIGNUP: 'user_signup',
  PROFILE_UPDATE: 'profile_update',
  DATA_ACCESS: 'data_access',
  ERROR: 'error'
};

// Tipos de respuesta de API
export class APIResponse {
  constructor(success, data = null, error = null) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success(data = null) {
    return new APIResponse(true, data, null);
  }

  static error(error) {
    return new APIResponse(false, null, error);
  }
}

// Tipos de perfil de usuario
export const ProfileType = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
  ADMIN: 'admin',
  GUEST: 'guest'
};

// Tipos de notificaciones
export const NotificationType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Tipos de dispositivos
export const DeviceType = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  WEB: 'web'
};

// Configuración de paginación
export const PaginationConfig = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

// Estados de carga
export const LoadingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};
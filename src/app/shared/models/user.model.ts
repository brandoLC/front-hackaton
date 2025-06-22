export interface User {
  user_id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_in: number;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Mantenemos AuthResponse para compatibilidad interna
export interface AuthResponse {
  user: User;
  token: string;
  expires_in?: number;
}

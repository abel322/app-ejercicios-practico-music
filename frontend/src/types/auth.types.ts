export const Instrument = {
  PIANO: 'PIANO',
  BASS: 'BASS',
  DRUMS: 'DRUMS',
  GUITAR: 'GUITAR',
} as const;

export type Instrument = typeof Instrument[keyof typeof Instrument];

export const Level = {
  BASIC: 'BASIC',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
} as const;

export type Level = typeof Level[keyof typeof Level];

export interface User {
  id: string;
  name: string;
  email: string;
  instruments: Instrument[];
  currentLevel: Level;
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  instruments: Instrument[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

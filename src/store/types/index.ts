export * from './auth.types';

// Root state type - will be updated as we add more slices
export interface RootState {
  auth: import('./auth.types').AuthState;
}

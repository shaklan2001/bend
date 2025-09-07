import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom auth hooks for convenience
export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  return {
    ...auth,
    dispatch,
  };
};

// Selector hooks for specific auth data
export const useAuthUser = () => useAppSelector(state => state.auth.user);
export const useAuthLoading = () => useAppSelector(state => state.auth.loading);
export const useAuthError = () => useAppSelector(state => state.auth.error);
export const useIsAuthenticated = () => useAppSelector(state => state.auth.isAuthenticated);

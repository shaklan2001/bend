import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../lib/authService';
import { AuthError, AuthState, SignInData, SignUpData, User } from '../types/auth.types';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk actions
export const signUpUser = createAsyncThunk<User, SignUpData, { rejectValue: AuthError }>(
  'auth/signUp',
  async (signUpData, { rejectWithValue }) => {
    try {
      const result = await authService.signUp(signUpData);

      if (!result.success) {
        return rejectWithValue({
          message: result.error || 'Sign up failed',
        });
      }

      if (!result.user) {
        return rejectWithValue({
          message: 'No user data received',
        });
      }

      return result.user;
    } catch (error) {
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }
);

export const signInUser = createAsyncThunk<User, SignInData, { rejectValue: AuthError }>(
  'auth/signIn',
  async (signInData, { rejectWithValue }) => {
    try {
      const result = await authService.signIn(signInData);

      if (!result.success) {
        return rejectWithValue({
          message: result.error || 'Sign in failed',
        });
      }

      if (!result.user) {
        return rejectWithValue({
          message: 'No user data received',
        });
      }

      return result.user;
    } catch (error) {
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }
);

export const signOutUser = createAsyncThunk<void, void, { rejectValue: AuthError }>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.signOut();

      if (!result.success) {
        return rejectWithValue({
          message: result.error || 'Sign out failed',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }
);

export const getCurrentUser = createAsyncThunk<User | null, void, { rejectValue: AuthError }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'Failed to get current user',
      });
    }
  }
);

export const resetPassword = createAsyncThunk<void, string, { rejectValue: AuthError }>(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const result = await authService.resetPassword(email);

      if (!result.success) {
        return rejectWithValue({
          message: result.error || 'Password reset failed',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  User,
  { userId: string; updates: Partial<User> },
  { rejectValue: AuthError }
>('auth/updateProfile', async ({ userId, updates }, { rejectWithValue }) => {
  try {
    const result = await authService.updateProfile(userId, updates);

    if (!result.success) {
      return rejectWithValue({
        message: result.error || 'Profile update failed',
      });
    }

    if (!result.user) {
      return rejectWithValue({
        message: 'No user data received after update',
      });
    }

    return result.user;
  } catch (error) {
    return rejectWithValue({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: state => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    resetAuth: () => initialState,
  },
  extraReducers: builder => {
    // Sign Up
    builder
      .addCase(signUpUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Sign up failed';
        state.user = null;
        state.isAuthenticated = false;
      });

    // Sign In
    builder
      .addCase(signInUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Sign in failed';
        state.user = null;
        state.isAuthenticated = false;
      });

    // Sign Out
    builder
      .addCase(signOutUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Sign out failed';
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get current user';
        state.user = null;
        state.isAuthenticated = false;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Password reset failed';
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Profile update failed';
      });
  },
});

// Export actions
export const { clearError, setLoading, setUser, resetAuth } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export the state type for TypeScript
export type { AuthState };

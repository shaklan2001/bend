import { supabase } from './supabase';
import { Alert } from 'react-native';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
    try {
      // Validate inputs
      if (!email || !password || !fullName) {
        return {
          success: false,
          error: 'Please fill in all required fields',
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long',
        };
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Failed to create user account',
        };
      }

      // Get the created profile
      const profile = await this.getProfile(data.user.id);

      return {
        success: true,
        user: profile || {
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName,
        },
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign up',
      };
    }
  }

  /**
   * Sign in existing user with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          error: 'Please enter both email and password',
        };
      }

      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Failed to sign in',
        };
      }

      // Get the user profile
      const profile = await this.getProfile(data.user.id);

      return {
        success: true,
        user: profile || {
          id: data.user.id,
          email: data.user.email || email,
        },
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign in',
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign out',
      };
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      // Get the user profile from the profiles table
      const profile = await this.getProfile(user.id);

      return (
        profile || {
          id: user.id,
          email: user.email || '',
        }
      );
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get user profile from profiles table
   */
  async getProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) {
        console.error('Get profile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update profile error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating profile',
      };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      if (!email) {
        return {
          success: false,
          error: 'Please enter your email address',
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim());

      if (error) {
        console.error('Reset password error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while sending reset email',
      };
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        callback(
          profile || {
            id: session.user.id,
            email: session.user.email || '',
          }
        );
      } else {
        callback(null);
      }
    });
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return !!session?.user;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();
export default authService;

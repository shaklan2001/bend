import { syncLocalFavoritesToDatabase } from './favoriteManager';
import { syncLocalHistoryToDatabase } from './historyManager';
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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

type AuthStateListener = (state: AuthState) => void;

class AuthService {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  private listeners: Set<AuthStateListener> = new Set();
  private authStateUnsubscribe: (() => void) | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    this.setLoading(true);
    try {
      const user = await this.getCurrentUser();
      this.setState({ user, isAuthenticated: !!user, loading: false });
      this.setupAuthListener();
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.setState({ user: null, isAuthenticated: false, loading: false });
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private setLoading(loading: boolean) {
    this.setState({ loading });
  }

  private setError(error: string | null) {
    this.setState({ error });
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: AuthStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public getCurrentUserFromState(): User | null {
    return this.state.user;
  }

  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  public isLoading(): boolean {
    return this.state.loading;
  }

  public getError(): string | null {
    return this.state.error;
  }

  async signUp({ email, password, fullName }: SignUpData): Promise<{ success: boolean; error?: string }> {
    try {
      this.setLoading(true);
      this.setError(null);

      if (!email || !password || !fullName) {
        const error = 'Please fill in all required fields';
        this.setError(error);
        return { success: false, error };
      }

      if (password.length < 6) {
        const error = 'Password must be at least 6 characters long';
        this.setError(error);
        return { success: false, error };
      }

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
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        const error = 'Failed to create user account';
        this.setError(error);
        return { success: false, error };
      }

      const profile = await this.getProfile(data.user.id);
      const user = profile || {
        id: data.user.id,
        email: data.user.email || email,
        full_name: fullName,
      };

      this.setState({ user, isAuthenticated: true, loading: false });
      
      try {
        await syncLocalHistoryToDatabase();
        console.log('✅ Local history synced to database after sign up');
      } catch (error) {
        console.error('Error syncing history after sign up:', error);
      }
      
      try {
        await syncLocalFavoritesToDatabase();
        console.log('✅ Local favorites synced to database after sign up');
      } catch (error) {
        console.error('Error syncing favorites after sign up:', error);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = 'An unexpected error occurred during sign up';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async signIn({ email, password }: SignInData): Promise<{ success: boolean; error?: string }> {
    try {
      this.setLoading(true);
      this.setError(null);

      if (!email || !password) {
        const error = 'Please enter both email and password';
        this.setError(error);
        return { success: false, error };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        const error = 'Failed to sign in';
        this.setError(error);
        return { success: false, error };
      }

      const profile = await this.getProfile(data.user.id);
      const user = profile || {
        id: data.user.id,
        email: data.user.email || email,
      };

      this.setState({ user, isAuthenticated: true, loading: false });
      
      try {
        await syncLocalHistoryToDatabase();
        console.log('✅ Local history synced to database after sign in');
      } catch (error) {
        console.error('Error syncing history after sign in:', error);
      }
      
      try {
        await syncLocalFavoritesToDatabase();
        console.log('✅ Local favorites synced to database after sign in');
      } catch (error) {
        console.error('Error syncing favorites after sign in:', error);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = 'An unexpected error occurred during sign in';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      this.setLoading(true);
      this.setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      this.setState({ user: null, isAuthenticated: false, loading: false });
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      const errorMessage = 'An unexpected error occurred during sign out';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

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

  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      this.setLoading(true);
      this.setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update profile error:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      this.setState({ user: data, loading: false });
      return { success: true, user: data };
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = 'An unexpected error occurred while updating profile';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.setLoading(true);
      this.setError(null);

      if (!email) {
        const error = 'Please enter your email address';
        this.setError(error);
        return { success: false, error };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim());

      if (error) {
        console.error('Reset password error:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      this.setState({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = 'An unexpected error occurred while sending reset email';
      this.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  private setupAuthListener() {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
    }

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_OUT' || !session?.user) {
        this.setState({ user: null, isAuthenticated: false, loading: false });
        return;
      }

      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        const user = profile || {
          id: session.user.id,
          email: session.user.email || '',
        };
        this.setState({ user, isAuthenticated: true, loading: false });
        
        try {
          await syncLocalHistoryToDatabase();
          console.log('✅ Local history synced to database via auth state change');
        } catch (error) {
          console.error('Error syncing history via auth state change:', error);
        }
        
        try {
          await syncLocalFavoritesToDatabase();
          console.log('✅ Local favorites synced to database via auth state change');
        } catch (error) {
          console.error('Error syncing favorites via auth state change:', error);
        }
      }
    });

    this.authStateUnsubscribe = data.subscription.unsubscribe;
  }

  public cleanup() {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
      this.authStateUnsubscribe = null;
    }
    this.listeners.clear();
  }
}

export const authService = new AuthService();
export default authService;

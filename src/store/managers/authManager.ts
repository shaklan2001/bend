import { AppDispatch } from '../index';
import { setLoading, setUser } from '../slices/authSlice';
import { authService } from '../../lib/authService';

class AuthManager {
  private dispatch: AppDispatch | null = null;
  private unsubscribe: (() => void) | null = null;

  init(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    this.setupAuthListener();
    this.checkInitialAuth();
  }

  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  private setupAuthListener() {
    if (!this.dispatch) return;

    this.unsubscribe = authService.onAuthStateChange(user => {
      if (this.dispatch) {
        this.dispatch(setUser(user));
        this.dispatch(setLoading(false));
      }
    }).data.subscription.unsubscribe;
  }

  private async checkInitialAuth() {
    if (!this.dispatch) return;

    try {
      this.dispatch(setLoading(true));
      const user = await authService.getCurrentUser();
      this.dispatch(setUser(user));
    } catch (error) {
      console.error('Error checking initial auth:', error);
      this.dispatch(setUser(null));
    } finally {
      this.dispatch(setLoading(false));
    }
  }
}

export const authManager = new AuthManager();
export default authManager;

import type { AuthTokens, User, Admin, AdminTokens } from '@/types';

/**
 * 認証管理ユーティリティ
 */
export class AuthManager {
  private static readonly USER_TOKENS_KEY = 'auth_tokens';
  private static readonly ADMIN_TOKENS_KEY = 'admin_tokens';
  private static readonly USER_KEY = 'user_data';
  private static readonly ADMIN_KEY = 'admin_data';

  /**
   * ブラウザ環境かどうかチェック
   */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // ========================================
  // ユーザー認証管理
  // ========================================

  /**
   * ユーザートークンを保存
   */
  static saveUserTokens(tokens: AuthTokens): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(this.USER_TOKENS_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to save user tokens:', error);
    }
  }

  /**
   * ユーザートークンを取得
   */
  static getUserTokens(): AuthTokens | null {
    if (!this.isBrowser()) return null;
    
    try {
      const tokens = localStorage.getItem(this.USER_TOKENS_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Failed to get user tokens:', error);
      return null;
    }
  }

  /**
   * ユーザーデータを保存
   */
  static saveUser(user: User): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  /**
   * ユーザーデータを取得
   */
  static getUser(): User | null {
    if (!this.isBrowser()) return null;
    
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  /**
   * ユーザー認証データをクリア
   */
  static clearUserAuth(): void {
    if (!this.isBrowser()) return;
    
    localStorage.removeItem(this.USER_TOKENS_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * ユーザーが認証済みかチェック
   */
  static isUserAuthenticated(): boolean {
    const tokens = this.getUserTokens();
    if (!tokens) return false;

    // トークンの有効期限をチェック（簡易版）
    try {
      const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      console.error('Failed to validate token:', error);
      return false;
    }
  }

  // ========================================
  // 管理者認証管理
  // ========================================

  /**
   * 管理者トークンを保存
   */
  static saveAdminTokens(adminTokens: AdminTokens): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(this.ADMIN_TOKENS_KEY, JSON.stringify(adminTokens));
    } catch (error) {
      console.error('Failed to save admin tokens:', error);
    }
  }

  /**
   * 管理者トークンを取得
   */
  static getAdminTokens(): AdminTokens | null {
    if (!this.isBrowser()) return null;
    
    try {
      const tokens = localStorage.getItem(this.ADMIN_TOKENS_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Failed to get admin tokens:', error);
      return null;
    }
  }

  /**
   * 管理者データを保存
   */
  static saveAdmin(admin: Admin): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admin));
    } catch (error) {
      console.error('Failed to save admin data:', error);
    }
  }

  /**
   * 管理者データを取得
   */
  static getAdmin(): Admin | null {
    if (!this.isBrowser()) return null;
    
    try {
      const admin = localStorage.getItem(this.ADMIN_KEY);
      return admin ? JSON.parse(admin) : null;
    } catch (error) {
      console.error('Failed to get admin data:', error);
      return null;
    }
  }

  /**
   * 管理者認証データをクリア
   */
  static clearAdminAuth(): void {
    if (!this.isBrowser()) return;
    
    localStorage.removeItem(this.ADMIN_TOKENS_KEY);
    localStorage.removeItem(this.ADMIN_KEY);
  }

  /**
   * 管理者が認証済みかチェック
   */
  static isAdminAuthenticated(): boolean {
    const adminTokens = this.getAdminTokens();
    if (!adminTokens) return false;

    // トークンの有効期限をチェック（簡易版）
    try {
      const payload = JSON.parse(atob(adminTokens.tokens.access_token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      console.error('Failed to validate admin token:', error);
      return false;
    }
  }

  // ========================================
  // 共通ユーティリティ
  // ========================================

  /**
   * 全認証データをクリア
   */
  static clearAllAuth(): void {
    this.clearUserAuth();
    this.clearAdminAuth();
  }

  /**
   * トークンをデコード（デバッグ用）
   */
  static decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * トークンの有効期限を取得
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const payload = this.decodeToken(token);
      return payload?.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      console.error('Failed to get token expiration:', error);
      return null;
    }
  }

  /**
   * トークンの残り時間を取得（分単位）
   */
  static getTokenTimeRemaining(token: string): number {
    try {
      const expiration = this.getTokenExpiration(token);
      if (!expiration) return 0;
      
      const now = new Date();
      const diff = expiration.getTime() - now.getTime();
      return Math.floor(diff / (1000 * 60)); // 分単位
    } catch (error) {
      console.error('Failed to get token time remaining:', error);
      return 0;
    }
  }

  /**
   * トークンの自動リフレッシュが必要かチェック
   * （有効期限の10分前）
   */
  static shouldRefreshToken(token: string): boolean {
    const timeRemaining = this.getTokenTimeRemaining(token);
    return timeRemaining > 0 && timeRemaining <= 10;
  }
}
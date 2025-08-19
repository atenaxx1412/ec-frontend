'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { AuthManager } from '@/lib/auth';
import type { User, AuthTokens, LoginRequest, RegisterRequest, AuthState } from '@/types';

/**
 * ユーザー認証フック
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // 初期化時に保存されている認証情報を復元
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * 認証状態の初期化
   */
  const initializeAuth = async () => {
    try {
      const tokens = AuthManager.getUserTokens();
      const user = AuthManager.getUser();

      if (tokens && user && AuthManager.isUserAuthenticated()) {
        // 保存されているトークンでAPIクライアントを初期化
        apiClient.setAccessToken(tokens.access_token);

        // プロフィールを再取得して最新状態を確認
        const profileResponse = await apiClient.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setState({
            user: profileResponse.data,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          // 最新のユーザー情報を保存
          AuthManager.saveUser(profileResponse.data);
        } else {
          // プロフィール取得に失敗した場合は認証をクリア
          await logout();
        }
      } else {
        // 認証情報がない、または無効な場合
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
        }));
      }
    } catch (error) {
      console.error('Authentication initialization failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
      
      // エラーが発生した場合は認証情報をクリア
      AuthManager.clearUserAuth();
      apiClient.clearAccessToken();
    }
  };

  /**
   * ログイン
   */
  const login = async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.login(credentials);

      if (response.success && response.data) {
        // トークンを保存
        AuthManager.saveUserTokens(response.data);

        // プロフィールを取得
        const profileResponse = await apiClient.getProfile();
        if (profileResponse.success && profileResponse.data) {
          AuthManager.saveUser(profileResponse.data);

          setState({
            user: profileResponse.data,
            tokens: response.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } else {
          throw new Error('Failed to get user profile');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  /**
   * ユーザー登録
   */
  const register = async (userData: RegisterRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.register(userData);

      if (response.success && response.data) {
        // トークンを保存
        AuthManager.saveUserTokens(response.data);

        // プロフィールを取得
        const profileResponse = await apiClient.getProfile();
        if (profileResponse.success && profileResponse.data) {
          AuthManager.saveUser(profileResponse.data);

          setState({
            user: profileResponse.data,
            tokens: response.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } else {
          throw new Error('Failed to get user profile');
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  /**
   * ログアウト
   */
  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // サーバーサイドログアウト（エラーは無視）
      if (state.isAuthenticated) {
        await apiClient.logout().catch(console.error);
      }
    } finally {
      // クライアントサイドクリーンアップ
      AuthManager.clearUserAuth();
      apiClient.clearAccessToken();

      setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  /**
   * プロフィール更新
   */
  const updateProfile = async () => {
    if (!state.isAuthenticated) return;

    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        AuthManager.saveUser(response.data);
        setState(prev => ({
          ...prev,
          user: response.data,
        }));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  /**
   * エラークリア
   */
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    // 状態
    user: state.user,
    tokens: state.tokens,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // メソッド
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };
}

/**
 * 管理者認証フック
 */
export function useAdminAuth() {
  const [state, setState] = useState<{
    admin: any | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    admin: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // 初期化時に保存されている管理者認証情報を復元
  useEffect(() => {
    initializeAdminAuth();
  }, []);

  /**
   * 管理者認証状態の初期化
   */
  const initializeAdminAuth = async () => {
    try {
      const adminTokens = AuthManager.getAdminTokens();

      if (adminTokens && AuthManager.isAdminAuthenticated()) {
        apiClient.setAccessToken(adminTokens.tokens.access_token);

        setState({
          admin: adminTokens.admin,
          tokens: adminTokens.tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Admin authentication initialization failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));

      AuthManager.clearAdminAuth();
      apiClient.clearAccessToken();
    }
  };

  /**
   * 管理者ログイン
   */
  const adminLogin = async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.adminLogin(credentials);

      if (response.success && response.data) {
        AuthManager.saveAdminTokens(response.data);

        setState({
          admin: response.data.admin,
          tokens: response.data.tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        throw new Error(response.message || 'Admin login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Admin login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  /**
   * 管理者ログアウト
   */
  const adminLogout = async () => {
    AuthManager.clearAdminAuth();
    apiClient.clearAccessToken();

    setState({
      admin: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    admin: state.admin,
    tokens: state.tokens,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    adminLogin,
    adminLogout,
  };
}
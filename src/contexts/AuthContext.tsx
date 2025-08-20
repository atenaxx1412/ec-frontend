'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth, useAdminAuth } from '@/hooks/useAuth';
import type { User, Admin, AuthTokens } from '@/types';

// ユーザー認証コンテキストの型定義
interface AuthContextType {
  // ユーザー認証
  user: User | null;
  userTokens: AuthTokens | null;
  isUserAuthenticated: boolean;
  isUserLoading: boolean;
  userError: string | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: () => Promise<void>;
  clearUserError: () => void;

  // 管理者認証
  admin: Admin | null;
  adminTokens: AuthTokens | null;
  isAdminAuthenticated: boolean;
  isAdminLoading: boolean;
  adminError: string | null;
  adminLogin: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
}

// コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証プロバイダーコンポーネント
 * アプリ全体で認証状態を管理
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // ユーザー認証フック
  const {
    user,
    tokens: userTokens,
    isAuthenticated: isUserAuthenticated,
    isLoading: isUserLoading,
    error: userError,
    login,
    register,
    logout,
    updateProfile,
    clearError: clearUserError,
  } = useAuth();

  // 管理者認証フック
  const {
    admin,
    tokens: adminTokens,
    isAuthenticated: isAdminAuthenticated,
    isLoading: isAdminLoading,
    error: adminError,
    adminLogin,
    adminLogout,
  } = useAdminAuth();

  const value: AuthContextType = {
    // ユーザー認証
    user,
    userTokens,
    isUserAuthenticated,
    isUserLoading,
    userError,
    login,
    register,
    logout,
    updateProfile,
    clearUserError,

    // 管理者認証
    admin,
    adminTokens,
    isAdminAuthenticated,
    isAdminLoading,
    adminError,
    adminLogin,
    adminLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 認証コンテキストを使用するカスタムフック
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

/**
 * ユーザー認証のみを使用するカスタムフック
 */
export function useUserAuth() {
  const {
    user,
    userTokens,
    isUserAuthenticated,
    isUserLoading,
    userError,
    login,
    register,
    logout,
    updateProfile,
    clearUserError,
  } = useAuthContext();

  return {
    user,
    tokens: userTokens,
    isAuthenticated: isUserAuthenticated,
    isLoading: isUserLoading,
    error: userError,
    login,
    register,
    logout,
    updateProfile,
    clearError: clearUserError,
  };
}

/**
 * 管理者認証のみを使用するカスタムフック
 */
export function useAdminAuthContext() {
  const {
    admin,
    adminTokens,
    isAdminAuthenticated,
    isAdminLoading,
    adminError,
    adminLogin,
    adminLogout,
  } = useAuthContext();

  return {
    admin,
    tokens: adminTokens,
    isAuthenticated: isAdminAuthenticated,
    isLoading: isAdminLoading,
    error: adminError,
    adminLogin,
    adminLogout,
  };
}
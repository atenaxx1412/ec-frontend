// 基本型の再エクスポート
export * from './api';

// React型定義
import { ReactNode, ComponentType } from 'react';

// フォーム型定義
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  agreeToTerms: boolean;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AddressFormData {
  firstName: string;
  lastName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  phone: string;
}

// UI状態型
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: import('./api').User | null;
  tokens: import('./api').AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AdminAuthState {
  admin: import('./api').Admin | null;
  tokens: import('./api').AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 検索・フィルター型
export interface ProductSearchParams {
  q?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: 'price' | 'created_at' | 'name';
  order?: 'asc' | 'desc';
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface CategoryFilter {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

// モーダル・ダイアログ型
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// 通知・トースト型
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// テーブル・リスト型
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// バリデーション型
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormFieldError {
  message: string;
  type: string;
}

// API エラー詳細型
export interface APIErrorDetail {
  field?: string;
  code: string;
  message: string;
}

// 環境設定型
export interface AppConfig {
  apiUrl: string;
  appEnv: 'development' | 'production' | 'staging';
  siteName: string;
  siteDescription: string;
}

// ユーティリティ型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// コンポーネント型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string | number; label: string }>;
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// カード・レイアウト型
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export interface ProductCardProps {
  product: import('./api').Product;
  onAddToCart?: (productId: number) => void;
  onViewDetails?: (productId: number) => void;
  showActions?: boolean;
}

// ナビゲーション型
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavItem[];
  isActive?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// データ取得フック型
export interface UseAPIResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UsePaginatedAPIResult<T> extends UseAPIResult<T[]> {
  pagination: import('./api').PaginationInfo | null;
  loadMore: () => void;
  hasMore: boolean;
}

// 定数型
export const SORT_OPTIONS = {
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  DATE_ASC: 'date-asc',
  DATE_DESC: 'date-desc',
} as const;

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
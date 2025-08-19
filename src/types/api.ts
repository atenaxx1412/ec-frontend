// 基本API レスポンス型
export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: any[];
  pagination?: PaginationInfo | null;
  timestamp: string;
  status_code: number;
}

// エラーレスポンス型
export interface ErrorResponse {
  success: false;
  message: string;
  error_code: string;
  errors: any[];
  timestamp: string;
}

// ページネーション型
export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 認証トークン型
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// 管理者トークン型
export interface AdminTokens {
  tokens: AuthTokens;
  admin: Admin;
}

// ユーザー型
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: number;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  name: string; // first_name + last_name の結合
}

// 管理者型
export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: number;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// 商品型（公開API用）
export interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  sku: string;
  image_url?: string;
  is_active: number;
  is_featured: number;
  weight?: number;
  dimensions?: string;
  category: {
    id: number;
    name: string;
  };
  review_count: number;
  average_rating?: number;
  created_at: string;
  updated_at: string;
}

// 管理者向け商品型
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  sku: string;
  is_active: number;
  is_featured: number;
  image_url?: string;
  weight?: number;
  dimensions?: string;
  category: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

// カテゴリ型
export interface Category {
  id: number;
  name: string;
  description: string;
  parent_id?: number;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

// カートアイテム型
export interface CartItem {
  id: number;
  quantity: number;
  subtotal: number;
  savings: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    is_active: number;
    category_name: string;
  };
  created_at: string;
  updated_at: string;
}

// カートサマリー型
export interface CartSummary {
  item_count: number;
  total_quantity: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total_savings: number;
  total: number;
  out_of_stock_items: number;
  has_issues: boolean;
  free_shipping_eligible: boolean;
  free_shipping_remaining: number;
}

// カート全体型
export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

// 住所型
export interface Address {
  first_name: string;
  last_name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address_line1: string;
  address_line2?: string;
  phone: string;
}

// 注文アイテム型
export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  total_price: number;
  discount_amount: number;
  final_price: number;
  product_name: string;
  product_sku: string;
  product_image_url?: string;
  current_product_name?: string;
  current_price: number;
  stock_quantity: number;
  savings: number;
}

// 注文型
export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  shipping_method: string;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  coupon_code?: string;
  coupon_discount?: number;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  items: OrderItem[];
  customer?: {
    user_id?: number;
    name?: string;
    email?: string;
    type?: 'guest';
    session_id?: string;
  };
  created_at: string;
  updated_at: string;
}

// 管理者ダッシュボード型
export interface AdminDashboard {
  statistics: {
    total_products: number;
    total_categories: number;
    total_users: number;
    low_stock_products: number;
    recent_orders: number;
    revenue_today: number;
    revenue_month: number;
  };
  recent_products: Array<{
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    is_active: number;
    created_at: string;
  }>;
  recent_users: Array<{
    id: number;
    email: string;
    created_at: string;
    name: string;
  }>;
  low_stock_products: Array<{
    id: number;
    name: string;
    stock_quantity: number;
    sku: string;
  }>;
}

// リクエスト型定義
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface CreateOrderRequest {
  shipping_method: 'standard' | 'express' | 'overnight';
  shipping_address: Address;
  billing_address?: Address;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
}
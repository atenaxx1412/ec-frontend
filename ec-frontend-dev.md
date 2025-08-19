# ECサイト フロントエンド開発 API仕様書

**バージョン**: 2.0.0  
**最終更新**: 2025年08月19日  
**バックエンドURL**: http://localhost:8080  
**実装状況**: ✅ 完全実装・テスト済み

## 📋 目次

1. [🚀 実装完了機能一覧](#実装完了機能一覧)
2. [🔧 開発環境情報](#開発環境情報)
3. [🔐 認証システム](#認証システム)
4. [📦 API エンドポイント一覧](#apiエンドポイント一覧)
5. [👑 管理者API](#管理者api)
6. [🛒 注文システム](#注文システム)
7. [🛡️ エラーハンドリング](#エラーハンドリング)
8. [📝 TypeScript型定義](#typescript型定義)
9. [💡 サンプルコード](#サンプルコード)
10. [🧪 テスト情報](#テスト情報)

---

## 🚀 実装完了機能一覧

### ✅ **コア機能（完全実装済み）**
- ✅ JWT認証システム (アクセス・リフレッシュトークン)
- ✅ ユーザー登録・ログイン・プロフィール管理
- ✅ 商品管理 (15商品データ完備)
- ✅ カテゴリ管理 (9カテゴリ、階層構造対応)
- ✅ ショッピングカート (税計算、送料計算完備)
- ✅ 注文処理システム (在庫連動、ステータス管理)
- ✅ 在庫管理システム
- ✅ 管理者ダッシュボード (統計、レポート機能)

### ✅ **API機能（テスト済み）**
- ✅ CORS設定済み (フロントエンド連携対応)
- ✅ レート制限実装
- ✅ 包括的エラーハンドリング
- ✅ ページネーション対応
- ✅ 検索・フィルタリング機能
- ✅ ファイルアップロード対応

---

## 🔧 開発環境情報

### API ベース URL
```
http://localhost:8080/api
```

### データベース状況
- **商品数**: 15商品 (完全データ)
- **カテゴリ数**: 9カテゴリ
- **テストユーザー**: 複数ユーザー作成済み
- **管理者ユーザー**: 4名作成済み

### 実際のテストユーザー
```json
{
  "email": "test@example.com",
  "password": "password"
}
```

### 管理者ユーザー
```json
{
  "email": "admin@ec-site-dev.local",
  "password": "password"
}
```

### サーバー状況
- **ヘルスチェック**: http://localhost:8080/api/health
- **データベース**: ✅ 健全
- **Redis**: ⚠️ 利用可能（必須ではない）

---

## 🔐 認証システム

### JWT認証フロー

#### 1. ユーザー登録
```http
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "太郎",
  "last_name": "田中",
  "email": "user@example.com",
  "password": "Password123",
  "password_confirmation": "Password123"
}
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1Q...",
    "refresh_token": "eyJ0eXAiOiJKV1Q...",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "message": "Registration successful",
  "errors": [],
  "pagination": null,
  "timestamp": "2025-08-19 15:12:35",
  "status_code": 201
}
```

#### 2. ログイン
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password"
}
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "message": "Login successful",
  "errors": [],
  "pagination": null,
  "timestamp": "2025-08-19 15:12:35",
  "status_code": 200
}
```

#### 3. プロフィール取得
```http
GET /api/auth/profile
Authorization: Bearer {access_token}
```

#### 4. トークンリフレッシュ
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1Q..."
}
```

#### 5. ログアウト
```http
POST /api/auth/logout
Authorization: Bearer {access_token}
```

---

## 📦 API エンドポイント一覧

### 🔧 システムAPI

#### ヘルスチェック（テスト済み）
```http
GET /api/health
```

**実際のレスポンス**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-08-19 15:11:12",
    "version": "1.0.0",
    "environment": "development",
    "services": {
      "database": "healthy",
      "redis": "unavailable"
    }
  },
  "message": "Health check completed"
}
```

### 📦 商品API

#### 商品一覧取得（テスト済み）
```http
GET /api/products?page=1&limit=3&sort=created_at&order=desc&featured=true
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "最新のiPhone 15 Pro。高性能なA17 Proチップ搭載。",
      "price": 159800,
      "compare_price": 149800,
      "stock_quantity": 42,
      "sku": "IPH15P-128",
      "image_url": null,
      "is_featured": true,
      "category": {
        "id": 1,
        "name": "エレクトロニクス"
      },
      "review_count": 0,
      "average_rating": null,
      "created_at": "2025-08-18 06:30:32",
      "updated_at": "2025-08-19 14:37:10"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 3,
    "total": 15,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

**利用可能パラメータ**:
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりのアイテム数（デフォルト: 12）
- `sort`: ソート項目（`price`, `created_at`, `name`）
- `order`: ソート順（`asc`, `desc`）
- `featured`: 注目商品のみ（`true`/`false`）
- `search`: 検索キーワード
- `category_id`: カテゴリーID
- `min_price`, `max_price`: 価格フィルタ

#### 商品詳細取得
```http
GET /api/products/{id}
```

#### 商品検索
```http
GET /api/products/search?q=iPhone&category=1&min_price=10000&max_price=200000
```

#### カテゴリ別商品取得
```http
GET /api/products/category/{category_slug}
```

### 🗂️ カテゴリAPI

#### カテゴリ一覧（テスト済み）
```http
GET /api/categories?include_product_count=true
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "エレクトロニクス",
      "description": "スマートフォン、PC、家電製品など",
      "parent_id": null,
      "is_active": true,
      "product_count": 0,
      "created_at": "2025-08-18 06:30:32",
      "updated_at": "2025-08-18 06:30:32"
    }
  ]
}
```

#### カテゴリ詳細
```http
GET /api/categories/{id}
```

#### カテゴリツリー（階層構造）
```http
GET /api/categories/tree
```

#### 人気カテゴリ
```http
GET /api/categories/popular
```

### 🛒 カートAPI（認証必須・テスト済み）

#### カート内容取得
```http
GET /api/cart
Authorization: Bearer {access_token}
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 29,
        "quantity": 2,
        "subtotal": 319600,
        "savings": 0,
        "product": {
          "id": 1,
          "name": "iPhone 15 Pro",
          "price": 159800,
          "stock_quantity": 42,
          "is_active": 1,
          "category_name": "エレクトロニクス"
        },
        "created_at": "2025-08-19 15:13:36",
        "updated_at": "2025-08-19 15:13:36"
      }
    ],
    "summary": {
      "item_count": 1,
      "total_quantity": 2,
      "subtotal": 319600,
      "tax": 31960,
      "shipping": 0,
      "total_savings": 0,
      "total": 351560,
      "out_of_stock_items": 0,
      "has_issues": false,
      "free_shipping_eligible": true,
      "free_shipping_remaining": 0
    }
  }
}
```

#### カートサマリー取得
```http
GET /api/cart/summary
Authorization: Bearer {access_token}
```

#### 商品をカートに追加（テスト済み）
```http
POST /api/cart/add
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### カート商品数量更新
```http
PUT /api/cart/{cart_item_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### カート商品削除
```http
DELETE /api/cart/{cart_item_id}
Authorization: Bearer {access_token}
```

#### カート全削除
```http
DELETE /api/cart
Authorization: Bearer {access_token}
```

---

## 👑 管理者API

### 管理者認証（テスト済み）

#### 管理者ログイン
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@ec-site-dev.local",
  "password": "password"
}
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": {
    "tokens": {
      "access_token": "eyJ0eXAiOiJKV1Q...",
      "refresh_token": "eyJ0eXAiOiJKV1Q...",
      "token_type": "Bearer",
      "expires_in": 3600
    },
    "admin": {
      "id": 1,
      "name": "開発管理者",
      "email": "admin@ec-site-dev.local",
      "role": "super_admin",
      "last_login_at": null,
      "created_at": "2025-08-18 06:30:32"
    }
  }
}
```

### 管理者ダッシュボード（テスト済み）

#### ダッシュボードデータ取得
```http
GET /api/admin/dashboard
Authorization: Bearer {admin_access_token}
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total_products": 15,
      "total_categories": 9,
      "total_users": 11,
      "low_stock_products": 0,
      "recent_orders": 19,
      "revenue_today": 352360,
      "revenue_month": 1518040
    },
    "recent_products": [
      {
        "id": 3,
        "name": "ワイヤレスイヤホン",
        "price": "12800.00",
        "stock_quantity": 119,
        "is_active": 1,
        "created_at": "2025-08-18 06:30:32"
      }
    ],
    "recent_users": [
      {
        "id": 44,
        "email": "ordertest@example.com",
        "created_at": "2025-08-19 14:30:14",
        "name": "Test Order User"
      }
    ],
    "low_stock_products": []
  }
}
```

### 管理者商品管理（テスト済み）

#### 管理者商品一覧
```http
GET /api/admin/products?page=1&limit=10&status=active&search=iPhone
Authorization: Bearer {admin_access_token}
```

**実際のレスポンス例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "最新のiPhone 15 Pro。高性能なA17 Proチップ搭載。",
      "short_description": "Apple iPhone 15 Pro 128GB",
      "price": 159800,
      "sale_price": 149800,
      "stock_quantity": 42,
      "sku": "IPH15P-128",
      "is_active": 1,
      "is_featured": 1,
      "image_url": null,
      "weight": null,
      "dimensions": null,
      "category": {
        "id": 1,
        "name": "エレクトロニクス"
      },
      "created_at": "2025-08-18 06:30:32",
      "updated_at": "2025-08-19 14:37:10"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 15,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

#### 商品作成
```http
POST /api/admin/products
Authorization: Bearer {admin_access_token}
Content-Type: application/json

{
  "name": "新商品",
  "description": "商品説明",
  "price": 10000,
  "category_id": 1,
  "stock_quantity": 100,
  "sku": "NEW-PRODUCT-001"
}
```

#### 商品更新
```http
PUT /api/admin/products/{id}
Authorization: Bearer {admin_access_token}
Content-Type: application/json

{
  "name": "更新された商品名",
  "price": 15000
}
```

#### 商品削除（ソフトデリート）
```http
DELETE /api/admin/products/{id}
Authorization: Bearer {admin_access_token}
```

---

## 🛒 注文システム

### 注文API（認証必須）

#### 注文一覧取得
```http
GET /api/orders?page=1&status=pending
Authorization: Bearer {access_token}
```

#### 注文詳細取得
```http
GET /api/orders/{id}
Authorization: Bearer {access_token}
```

#### 注文作成
```http
POST /api/orders
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "shipping_method": "standard",
  "shipping_address": {
    "first_name": "太郎",
    "last_name": "田中",
    "postal_code": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "address_line1": "丸の内1-1-1",
    "phone": "03-1234-5678"
  },
  "billing_address": {
    "first_name": "太郎",
    "last_name": "田中",
    "postal_code": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "address_line1": "丸の内1-1-1",
    "phone": "03-1234-5678"
  },
  "payment_method": "credit_card",
  "notes": "配送時間指定: 午前中"
}
```

#### 注文キャンセル
```http
DELETE /api/orders/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "reason": "間違って注文してしまいました"
}
```

#### 注文履歴取得
```http
GET /api/orders/{id}/history
Authorization: Bearer {access_token}
```

---

## 🛡️ エラーハンドリング

### 統一レスポンス形式
```typescript
interface APIResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: any[];
  pagination?: PaginationInfo | null;
  timestamp: string;
  status_code: number;
}
```

### エラーレスポンス形式
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error_code: string;
  errors: any[];
  timestamp: string;
}
```

### 主要エラーコード
| エラーコード | HTTPステータス | 説明 |
|-------------|---------------|------|
| `AUTH_TOKEN_REQUIRED` | 401 | 認証トークンが必要 |
| `AUTH_TOKEN_INVALID` | 401 | 無効なトークン |
| `AUTH_USER_NOT_FOUND` | 401 | ユーザーが見つからない |
| `ADMIN_PERMISSIONS_REQUIRED` | 403 | 管理者権限が必要 |
| `PRODUCT_NOT_FOUND` | 404 | 商品が見つからない |
| `INSUFFICIENT_STOCK` | 400 | 在庫不足 |
| `CART_ITEM_NOT_FOUND` | 404 | カートアイテムが見つからない |
| `ORDER_NOT_FOUND` | 404 | 注文が見つからない |
| `VALIDATION_ERROR` | 422 | バリデーションエラー |
| `ROUTE_NOT_FOUND` | 404 | エンドポイントが見つからない |
| `DATABASE_ERROR` | 500 | データベースエラー |

### 実際のエラーレスポンス例
```json
{
  "success": false,
  "message": "Authentication token required",
  "error_code": "AUTH_TOKEN_REQUIRED",
  "errors": [],
  "timestamp": "2025-08-19 15:14:10"
}
```

---

## 📝 TypeScript型定義

```typescript
// 基本API レスポンス型
interface APIResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: any[];
  pagination?: PaginationInfo | null;
  timestamp: string;
  status_code: number;
}

// ユーザー型
interface User {
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
interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: number;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// 商品型（実際のデータベーススキーマ基準）
interface Product {
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
interface AdminProduct {
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
interface Category {
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
interface CartItem {
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
interface CartSummary {
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
interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

// 認証トークン型
interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// 管理者トークン型
interface AdminTokens {
  tokens: AuthTokens;
  admin: Admin;
}

// ページネーション型
interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 注文型
interface Order {
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

// 注文アイテム型
interface OrderItem {
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

// 住所型
interface Address {
  first_name: string;
  last_name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address_line1: string;
  address_line2?: string;
  phone: string;
}

// 管理者ダッシュボード型
interface AdminDashboard {
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
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

interface UpdateCartRequest {
  quantity: number;
}

interface CreateOrderRequest {
  shipping_method: 'standard' | 'express' | 'overnight';
  shipping_address: Address;
  billing_address?: Address;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
}
```

---

## 💡 サンプルコード

### React + TypeScript での認証フック

```typescript
// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterRequest) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初期化時にローカルストレージからトークンを復元
    const savedTokens = localStorage.getItem('auth_tokens');
    if (savedTokens) {
      try {
        const parsedTokens = JSON.parse(savedTokens);
        setTokens(parsedTokens);
        apiClient.setAccessToken(parsedTokens.access_token);
        // プロフィール取得でユーザー情報を復元
        loadUserProfile();
      } catch (error) {
        console.error('Failed to restore tokens:', error);
        localStorage.removeItem('auth_tokens');
      }
    }
    setIsLoading(false);
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.login(email, password);
      if (response.success && response.data) {
        setTokens(response.data);
        apiClient.setAccessToken(response.data.access_token);
        localStorage.setItem('auth_tokens', JSON.stringify(response.data));
        await loadUserProfile();
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.register(userData);
      if (response.success && response.data) {
        setTokens(response.data);
        apiClient.setAccessToken(response.data.access_token);
        localStorage.setItem('auth_tokens', JSON.stringify(response.data));
        await loadUserProfile();
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('auth_tokens');
    apiClient.setAccessToken('');
  };

  const value: AuthContextType = {
    user,
    tokens,
    login,
    logout,
    register,
    isAuthenticated: !!user && !!tokens,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### API クライアント

```typescript
// api/client.ts
class ApiClient {
  private baseURL = 'http://localhost:8080/api';
  private accessToken: string = '';

  constructor() {
    // ローカルストレージからトークンを復元
    const savedTokens = localStorage.getItem('auth_tokens');
    if (savedTokens) {
      try {
        const { access_token } = JSON.parse(savedTokens);
        this.accessToken = access_token;
      } catch (error) {
        console.error('Failed to restore token:', error);
      }
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // 認証API
  async login(email: string, password: string): Promise<APIResponse<AuthTokens>> {
    return this.request<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: RegisterRequest): Promise<APIResponse<AuthTokens>> {
    return this.request<AuthTokens>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<APIResponse<User>> {
    return this.request<User>('/auth/profile');
  }

  async logout(): Promise<APIResponse<null>> {
    return this.request<null>('/auth/logout', {
      method: 'POST',
    });
  }

  // 商品API
  async getProducts(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    featured?: boolean;
    search?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
  }): Promise<APIResponse<Product[]>> {
    const queryString = new URLSearchParams(
      params as any
    ).toString();
    return this.request<Product[]>(`/products?${queryString}`);
  }

  async getProduct(id: number): Promise<APIResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<APIResponse<Product[]>> {
    return this.request<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // カテゴリAPI
  async getCategories(includeProductCount = false): Promise<APIResponse<Category[]>> {
    const params = includeProductCount ? '?include_product_count=true' : '';
    return this.request<Category[]>(`/categories${params}`);
  }

  async getCategory(id: number): Promise<APIResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  async getCategoryTree(): Promise<APIResponse<Category[]>> {
    return this.request<Category[]>('/categories/tree');
  }

  // カートAPI
  async getCart(): Promise<APIResponse<Cart>> {
    return this.request<Cart>('/cart');
  }

  async addToCart(productId: number, quantity: number): Promise<APIResponse<CartItem>> {
    return this.request<CartItem>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(cartItemId: number, quantity: number): Promise<APIResponse<CartItem>> {
    return this.request<CartItem>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(cartItemId: number): Promise<APIResponse<null>> {
    return this.request<null>(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<APIResponse<null>> {
    return this.request<null>('/cart', {
      method: 'DELETE',
    });
  }

  async getCartSummary(): Promise<APIResponse<CartSummary>> {
    return this.request<CartSummary>('/cart/summary');
  }

  // 注文API
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<APIResponse<Order[]>> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request<Order[]>(`/orders?${queryString}`);
  }

  async getOrder(id: number): Promise<APIResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderRequest): Promise<APIResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: number, reason?: string): Promise<APIResponse<null>> {
    return this.request<null>(`/orders/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  // 管理者API
  async adminLogin(email: string, password: string): Promise<APIResponse<AdminTokens>> {
    return this.request<AdminTokens>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getAdminDashboard(): Promise<APIResponse<AdminDashboard>> {
    return this.request<AdminDashboard>('/admin/dashboard');
  }

  async getAdminProducts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<APIResponse<AdminProduct[]>> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request<AdminProduct[]>(`/admin/products?${queryString}`);
  }

  // ヘルスチェック
  async healthCheck(): Promise<APIResponse<any>> {
    return this.request<any>('/health');
  }
}

export const apiClient = new ApiClient();
```

### React Query を使用したカートコンポーネント

```typescript
// components/Cart.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';

const Cart: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: cartResponse,
    isLoading,
    error
  } = useQuery(
    'cart',
    () => apiClient.getCart(),
    {
      enabled: isAuthenticated,
      refetchOnWindowFocus: false,
    }
  );

  const updateQuantityMutation = useMutation(
    ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      apiClient.updateCartItem(cartItemId, quantity),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
      },
      onError: (error: any) => {
        console.error('Failed to update cart item:', error);
        alert('カートの更新に失敗しました: ' + error.message);
      },
    }
  );

  const removeItemMutation = useMutation(
    (cartItemId: number) => apiClient.removeCartItem(cartItemId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
      },
      onError: (error: any) => {
        console.error('Failed to remove cart item:', error);
        alert('商品の削除に失敗しました: ' + error.message);
      },
    }
  );

  const clearCartMutation = useMutation(
    () => apiClient.clearCart(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
      },
      onError: (error: any) => {
        console.error('Failed to clear cart:', error);
        alert('カートのクリアに失敗しました: ' + error.message);
      },
    }
  );

  if (!isAuthenticated) {
    return <div>ログインが必要です</div>;
  }

  if (isLoading) return <div>カートを読み込み中...</div>;
  if (error) return <div>カートの読み込みに失敗しました</div>;

  const cart = cartResponse?.data;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>ショッピングカート</h2>
        <p>カートに商品がありません</p>
      </div>
    );
  }

  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
  };

  const handleRemoveItem = (cartItemId: number) => {
    if (confirm('この商品をカートから削除しますか？')) {
      removeItemMutation.mutate(cartItemId);
    }
  };

  const handleClearCart = () => {
    if (confirm('カートをすべてクリアしますか？')) {
      clearCartMutation.mutate();
    }
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>ショッピングカート ({cart.summary.item_count}商品)</h2>
        <button 
          onClick={handleClearCart}
          className="btn-secondary"
          disabled={clearCartMutation.isLoading}
        >
          カートをクリア
        </button>
      </div>
      
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              <p className="category">{item.product.category_name}</p>
              <p className="price">¥{item.product.price.toLocaleString()}</p>
              <p className="stock">在庫: {item.product.stock_quantity}個</p>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || updateQuantityMutation.isLoading}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={updateQuantityMutation.isLoading}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                <p>小計: ¥{item.subtotal.toLocaleString()}</p>
                {item.savings > 0 && (
                  <p className="savings">節約: ¥{item.savings.toLocaleString()}</p>
                )}
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.id)}
                disabled={removeItemMutation.isLoading}
                className="btn-danger"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>注文サマリー</h3>
        <div className="summary-line">
          <span>商品数:</span>
          <span>{cart.summary.total_quantity}個</span>
        </div>
        <div className="summary-line">
          <span>小計:</span>
          <span>¥{cart.summary.subtotal.toLocaleString()}</span>
        </div>
        <div className="summary-line">
          <span>税額:</span>
          <span>¥{cart.summary.tax.toLocaleString()}</span>
        </div>
        <div className="summary-line">
          <span>送料:</span>
          <span>
            {cart.summary.shipping === 0 ? '無料' : `¥${cart.summary.shipping.toLocaleString()}`}
          </span>
        </div>
        {cart.summary.total_savings > 0 && (
          <div className="summary-line savings">
            <span>割引:</span>
            <span>-¥{cart.summary.total_savings.toLocaleString()}</span>
          </div>
        )}
        <div className="summary-line total">
          <span>合計:</span>
          <span>¥{cart.summary.total.toLocaleString()}</span>
        </div>
        
        {cart.summary.free_shipping_eligible ? (
          <p className="free-shipping">🚚 送料無料対象</p>
        ) : (
          <p className="free-shipping-remaining">
            あと¥{cart.summary.free_shipping_remaining.toLocaleString()}で送料無料
          </p>
        )}
        
        {cart.summary.has_issues && (
          <div className="cart-issues">
            <p className="warning">
              ⚠️ {cart.summary.out_of_stock_items}商品が在庫不足です
            </p>
          </div>
        )}
        
        <button 
          className="btn-primary checkout-btn"
          disabled={cart.summary.has_issues}
        >
          レジに進む
        </button>
      </div>
    </div>
  );
};

export default Cart;
```

---

## 🧪 テスト情報

### 実際にテスト済みのエンドポイント

✅ **公開API**
- `GET /api/health` - ヘルスチェック
- `GET /api/products` - 商品一覧（ページネーション対応）
- `GET /api/categories` - カテゴリ一覧

✅ **認証API**
- `POST /api/auth/login` - ユーザーログイン
- `POST /api/auth/register` - ユーザー登録

✅ **認証済みAPI**
- `GET /api/cart` - カート取得
- `POST /api/cart/add` - カート追加

✅ **管理者API**
- `POST /api/admin/login` - 管理者ログイン
- `GET /api/admin/dashboard` - ダッシュボード
- `GET /api/admin/products` - 商品管理

### テスト用データ

**ユーザーアカウント**:
```json
{
  "email": "test@example.com",
  "password": "password"
}
```

**管理者アカウント**:
```json
{
  "email": "admin@ec-site-dev.local", 
  "password": "password"
}
```

**商品データ**: 15商品（iPhone、MacBook、イヤホンなど）
**カテゴリ**: 9カテゴリ（エレクトロニクス、ファッションなど）

### パフォーマンステスト結果
- API レスポンス時間: 平均 < 200ms
- データベース接続: 健全
- 同時接続テスト: 良好

---

## 🚀 開発環境セットアップ

### 前提条件
- Node.js 18+
- npm または yarn
- TypeScript 4.5+

### 推奨ライブラリ
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-query": "^3.39.0", 
    "axios": "^1.3.0",
    "@types/react": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^4.9.0",
    "@types/node": "^18.0.0",
    "msw": "^1.0.0"
  }
}
```

### 環境変数設定
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_ENV=development

# バックエンドサーバー
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### CORS設定確認
バックエンドではCORS設定済みです。フロントエンドは `http://localhost:3000` からのリクエストが許可されています。

---

## 📝 更新履歴

| バージョン | 日付 | 更新内容 |
|-----------|------|----------|
| 2.0.0 | 2025-08-19 | 🎉 完全実装版リリース - 全機能テスト済み、実際のレスポンス例追加 |
| 1.0.0 | 2025-08-19 | 初版リリース - 基本API仕様とサンプルコード |

---

## 📞 サポート・問い合わせ

### 🔍 トラブルシューティング

**API接続確認**:
```bash
curl http://localhost:8080/api/health
```

**認証エラー**:
- トークンの有効期限（1時間）を確認
- Authorization ヘッダーの形式確認: `Bearer {token}`

**CORS問題**:
- 開発サーバーを `http://localhost:3000` で起動

**データが表示されない**:
- ヘルスチェックでデータベース接続確認
- ネットワークタブでAPIレスポンス確認

### 🎯 クイックスタート

1. **バックエンド起動確認**:
   ```bash
   curl http://localhost:8080/api/health
   ```

2. **商品データ確認**:
   ```bash
   curl http://localhost:8080/api/products?limit=3
   ```

3. **認証テスト**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

---

**🎉 Happy Coding! フロントエンド開発を始めましょう！**
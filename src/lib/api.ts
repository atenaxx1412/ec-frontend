import type {
  APIResponse,
  AuthTokens,
  User,
  Product,
  Category,
  Cart,
  CartItem,
  CartSummary,
  Order,
  Admin,
  AdminTokens,
  AdminProduct,
  AdminDashboard,
  LoginRequest,
  RegisterRequest,
  AddToCartRequest,
  UpdateCartRequest,
  CreateOrderRequest,
  ProductSearchParams,
} from '@/types';

/**
 * API クライアントクラス
 * バックエンドAPI（localhost:8080）との通信を管理
 */
class ApiClient {
  private baseURL: string;
  private accessToken: string = '';

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    
    // ローカルストレージからトークンを復元（ブラウザ環境のみ）
    if (typeof window !== 'undefined') {
      const savedTokens = localStorage.getItem('auth_tokens');
      if (savedTokens) {
        try {
          const { access_token } = JSON.parse(savedTokens);
          this.accessToken = access_token;
        } catch (error) {
          console.error('Failed to restore token:', error);
          localStorage.removeItem('auth_tokens');
        }
      }
    }
  }

  /**
   * アクセストークンを設定
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * アクセストークンをクリア
   */
  clearAccessToken(): void {
    this.accessToken = '';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('admin_tokens');
    }
  }

  /**
   * 基本的なリクエストメソッド
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // 認証トークンがある場合は追加
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // ========================================
  // 認証API
  // ========================================

  /**
   * ユーザーログイン
   */
  async login(credentials: LoginRequest): Promise<APIResponse<AuthTokens>> {
    const response = await this.request<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // トークンを保存
    if (response.success && response.data) {
      this.setAccessToken(response.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_tokens', JSON.stringify(response.data));
      }
    }

    return response;
  }

  /**
   * ユーザー登録
   */
  async register(userData: RegisterRequest): Promise<APIResponse<AuthTokens>> {
    const response = await this.request<AuthTokens>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // トークンを保存
    if (response.success && response.data) {
      this.setAccessToken(response.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_tokens', JSON.stringify(response.data));
      }
    }

    return response;
  }

  /**
   * プロフィール取得
   */
  async getProfile(): Promise<APIResponse<User>> {
    return this.request<User>('/auth/profile');
  }

  /**
   * ログアウト
   */
  async logout(): Promise<APIResponse<null>> {
    const response = await this.request<null>('/auth/logout', {
      method: 'POST',
    });

    // トークンをクリア
    this.clearAccessToken();

    return response;
  }

  /**
   * トークンリフレッシュ
   */
  async refreshToken(refreshToken: string): Promise<APIResponse<AuthTokens>> {
    const response = await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.success && response.data) {
      this.setAccessToken(response.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_tokens', JSON.stringify(response.data));
      }
    }

    return response;
  }

  // ========================================
  // 商品API
  // ========================================

  /**
   * 商品一覧取得
   */
  async getProducts(params: ProductSearchParams = {}): Promise<APIResponse<Product[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return this.request<Product[]>(`/products?${queryString}`);
  }

  /**
   * 商品詳細取得
   */
  async getProduct(id: number): Promise<APIResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  /**
   * 商品検索
   */
  async searchProducts(query: string, filters: Partial<ProductSearchParams> = {}): Promise<APIResponse<Product[]>> {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return this.request<Product[]>(`/products/search?${queryString}`);
  }

  // ========================================
  // カテゴリAPI
  // ========================================

  /**
   * カテゴリ一覧取得
   */
  async getCategories(includeProductCount = false): Promise<APIResponse<Category[]>> {
    const params = includeProductCount ? '?include_product_count=true' : '';
    return this.request<Category[]>(`/categories${params}`);
  }

  /**
   * カテゴリ詳細取得
   */
  async getCategory(id: number): Promise<APIResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  /**
   * カテゴリツリー取得
   */
  async getCategoryTree(): Promise<APIResponse<Category[]>> {
    return this.request<Category[]>('/categories/tree');
  }

  // ========================================
  // カートAPI（認証必須）
  // ========================================

  /**
   * カート内容取得
   */
  async getCart(): Promise<APIResponse<Cart>> {
    return this.request<Cart>('/cart');
  }

  /**
   * カートサマリー取得
   */
  async getCartSummary(): Promise<APIResponse<CartSummary>> {
    return this.request<CartSummary>('/cart/summary');
  }

  /**
   * 商品をカートに追加
   */
  async addToCart(data: AddToCartRequest): Promise<APIResponse<CartItem>> {
    return this.request<CartItem>('/cart/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * カート商品数量更新
   */
  async updateCartItem(cartItemId: number, data: UpdateCartRequest): Promise<APIResponse<CartItem>> {
    return this.request<CartItem>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * カート商品削除
   */
  async removeCartItem(cartItemId: number): Promise<APIResponse<null>> {
    return this.request<null>(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  /**
   * カート全削除
   */
  async clearCart(): Promise<APIResponse<null>> {
    return this.request<null>('/cart', {
      method: 'DELETE',
    });
  }

  // ========================================
  // 注文API（認証必須）
  // ========================================

  /**
   * 注文一覧取得
   */
  async getOrders(params: { page?: number; limit?: number; status?: string } = {}): Promise<APIResponse<Order[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return this.request<Order[]>(`/orders?${queryString}`);
  }

  /**
   * 注文詳細取得
   */
  async getOrder(id: number): Promise<APIResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  /**
   * 注文作成
   */
  async createOrder(orderData: CreateOrderRequest): Promise<APIResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * 注文キャンセル
   */
  async cancelOrder(id: number, reason?: string): Promise<APIResponse<null>> {
    return this.request<null>(`/orders/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  // ========================================
  // 管理者API
  // ========================================

  /**
   * 管理者ログイン
   */
  async adminLogin(credentials: LoginRequest): Promise<APIResponse<AdminTokens>> {
    const response = await this.request<AdminTokens>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // 管理者トークンを保存
    if (response.success && response.data) {
      this.setAccessToken(response.data.tokens.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_tokens', JSON.stringify(response.data));
      }
    }

    return response;
  }

  /**
   * 管理者ダッシュボード取得
   */
  async getAdminDashboard(): Promise<APIResponse<AdminDashboard>> {
    return this.request<AdminDashboard>('/admin/dashboard');
  }

  /**
   * 管理者商品一覧取得
   */
  async getAdminProducts(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<APIResponse<AdminProduct[]>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return this.request<AdminProduct[]>(`/admin/products?${queryString}`);
  }

  // ========================================
  // システムAPI
  // ========================================

  /**
   * ヘルスチェック
   */
  async healthCheck(): Promise<APIResponse<any>> {
    return this.request<any>('/health');
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();

// 型エクスポート
export type { ApiClient };
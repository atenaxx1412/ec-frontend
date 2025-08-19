# ECサイト フロントエンド要件定義書

**プロジェクト名**: ECサイト フロントエンド  
**バージョン**: 1.0.0  
**作成日**: 2025年08月20日  
**技術スタック**: Node.js + Next.js (SSG)  
**デプロイ環境**: ロリポップ ハイスピードプラン  

---

## 📋 目次

1. [🎯 プロジェクト概要](#プロジェクト概要)
2. [🏗️ 技術仕様](#技術仕様)
3. [📱 機能要件](#機能要件)
4. [🎨 UI/UX要件](#uiux要件)
5. [⚡ パフォーマンス要件](#パフォーマンス要件)
6. [🛡️ セキュリティ要件](#セキュリティ要件)
7. [📱 レスポンシブ対応](#レスポンシブ対応)
8. [🚀 デプロイ要件](#デプロイ要件)
9. [📊 SEO要件](#seo要件)
10. [🧪 テスト要件](#テスト要件)

---

## 🎯 プロジェクト概要

### プロジェクト目的
- バックエンドAPI（http://localhost:8080/api）と連携するECサイトフロントエンドの構築
- ロリポップハイスピードプランでの静的サイト配信によるパフォーマンス最適化
- ユーザーフレンドリーなショッピング体験の提供

### ターゲットユーザー
- **一般ユーザー**: 商品閲覧・購入を行うエンドユーザー
- **管理者**: 商品・注文管理を行う運営担当者

### 主要な成功指標
- ページロード時間: 2秒以内
- モバイルフレンドリースコア: 95点以上
- Core Web Vitals: すべて「良好」
- ユーザビリティスコア: 90点以上

---

## 🏗️ 技術仕様

### 🔧 技術スタック

#### フロントエンド
```json
{
  "framework": "Next.js 14+",
  "runtime": "Node.js 18+",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "stateManagement": "Zustand",
  "dataFetching": "TanStack Query (React Query)",
  "forms": "React Hook Form + Zod",
  "ui": "Headless UI + Heroicons",
  "animations": "Framer Motion"
}
```

#### 開発・ビルドツール
```json
{
  "packageManager": "npm",
  "bundler": "Next.js内蔵Webpack",
  "linting": "ESLint + Prettier",
  "testing": "Jest + React Testing Library",
  "typeChecking": "TypeScript"
}
```

#### 本番環境
```json
{
  "hosting": "ロリポップ ハイスピードプラン",
  "deploymentType": "Static Site Generation (SSG)",
  "cdn": "ロリポップ内蔵CDN",
  "ssl": "Let's Encrypt（ロリポップ提供）"
}
```

### 📁 プロジェクト構造
```
ec-frontend/
├── public/                     # 静的ファイル
│   ├── images/                # 画像ファイル
│   ├── icons/                 # アイコンファイル
│   └── favicon.ico
├── src/
│   ├── app/                   # Next.js 14 App Router
│   │   ├── (auth)/           # 認証関連ページ
│   │   ├── (shop)/           # ショップページ
│   │   ├── admin/            # 管理画面
│   │   ├── globals.css       # グローバルスタイル
│   │   ├── layout.tsx        # ルートレイアウト
│   │   └── page.tsx          # ホームページ
│   ├── components/           # 再利用可能コンポーネント
│   │   ├── ui/              # UI基本コンポーネント
│   │   ├── forms/           # フォームコンポーネント
│   │   ├── layout/          # レイアウトコンポーネント
│   │   └── features/        # 機能別コンポーネント
│   ├── hooks/               # カスタムフック
│   ├── lib/                 # ユーティリティ・設定
│   │   ├── api/            # API関連
│   │   ├── auth/           # 認証関連
│   │   ├── utils/          # ユーティリティ関数
│   │   └── validations/    # バリデーション
│   ├── store/              # 状態管理
│   ├── types/              # TypeScript型定義
│   └── constants/          # 定数定義
├── .env.local              # 環境変数
├── next.config.js          # Next.js設定
├── tailwind.config.js      # Tailwind設定
└── package.json
```

---

## 📱 機能要件

### 🏠 公開ページ（SSG対応）

#### 1. ホームページ（/）
**機能**:
- ヒーローセクション
- 注目商品一覧（API: `/api/products?featured=true`）
- カテゴリ一覧（API: `/api/categories`）
- 新着商品一覧
- お客様の声・レビュー

**SSG実装**:
```typescript
// ISR（Incremental Static Regeneration）で1時間ごとに更新
export async function generateStaticParams() {
  return { revalidate: 3600 }
}
```

#### 2. 商品一覧ページ（/products）
**機能**:
- 商品グリッド表示（ページネーション対応）
- カテゴリフィルター
- 価格帯フィルター
- 検索機能
- ソート機能（価格、日付、人気度）

**API連携**:
- `GET /api/products` - 商品一覧取得
- `GET /api/categories` - カテゴリ一覧取得

#### 3. 商品詳細ページ（/products/[id]）
**機能**:
- 商品詳細情報表示
- 商品画像ギャラリー
- レビュー・評価表示
- 関連商品推奨
- カート追加機能
- 在庫状況表示

**SSG実装**:
```typescript
export async function generateStaticParams() {
  // 全商品IDを事前生成
  const products = await fetch(`${API_URL}/products`).then(res => res.json())
  return products.data.map((product: Product) => ({
    id: product.id.toString()
  }))
}
```

#### 4. カテゴリページ（/categories/[slug]）
**機能**:
- カテゴリ別商品一覧
- サブカテゴリナビゲーション
- カテゴリ説明文

#### 5. 検索結果ページ（/search）
**機能**:
- 検索キーワードによる商品検索
- 検索結果フィルタリング
- 検索履歴（ローカルストレージ）

### 🔐 認証ページ

#### 6. ログインページ（/auth/login）
**機能**:
- メールアドレス・パスワードによるログイン
- パスワード可視化トグル
- 「ログイン状態を保持」チェックボックス
- パスワードリセットリンク

**API連携**:
- `POST /api/auth/login`

#### 7. 会員登録ページ（/auth/register）
**機能**:
- 新規会員登録フォーム
- バリデーション（リアルタイム）
- 利用規約・プライバシーポリシー同意

**API連携**:
- `POST /api/auth/register`

#### 8. パスワードリセットページ（/auth/reset-password）
**機能**:
- メールアドレス入力による reset リンク送信
- 新パスワード設定

### 🛒 ユーザー専用ページ（要認証）

#### 9. マイページ（/account）
**機能**:
- ユーザー情報表示・編集
- 注文履歴一覧
- お気に入り商品一覧
- アカウント設定

**API連携**:
- `GET /api/auth/profile`
- `GET /api/orders`

#### 10. ショッピングカート（/cart）
**機能**:
- カート内商品一覧
- 数量変更・削除
- 小計・税込合計表示
- 送料計算表示
- チェックアウトボタン

**API連携**:
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/{id}`
- `DELETE /api/cart/{id}`

#### 11. チェックアウト（/checkout）
**機能**:
- 配送先情報入力
- 支払い方法選択
- 注文確認
- 注文完了処理

**API連携**:
- `POST /api/orders`

#### 12. 注文履歴（/orders）
**機能**:
- 過去の注文一覧
- 注文詳細表示
- 注文ステータス確認
- 注文キャンセル（可能な場合）

**API連携**:
- `GET /api/orders`
- `GET /api/orders/{id}`

### 👑 管理者ページ（要管理者権限）

#### 13. 管理者ダッシュボード（/admin）
**機能**:
- 売上統計表示
- 注文件数・商品数サマリー
- 在庫アラート
- グラフィカルなデータ表示

**API連携**:
- `GET /api/admin/dashboard`

#### 14. 商品管理（/admin/products）
**機能**:
- 商品一覧表示（検索・フィルター対応）
- 商品新規作成
- 商品編集・削除
- 在庫管理
- 商品画像アップロード

**API連携**:
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`

#### 15. 注文管理（/admin/orders）
**機能**:
- 注文一覧表示
- 注文ステータス更新
- 注文詳細確認
- 配送情報更新

---

## 🎨 UI/UX要件

### 🎨 デザインシステム

#### カラーパレット
```css
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Secondary Colors */
  --secondary-50: #fafaf9;
  --secondary-500: #78716c;
  --secondary-900: #1c1917;
  
  /* Success/Error */
  --success-500: #10b981;
  --error-500: #ef4444;
  --warning-500: #f59e0b;
  
  /* Neutral */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-500: #6b7280;
  --gray-900: #111827;
}
```

#### タイポグラフィ
```css
/* 日本語に最適化されたフォントスタック */
font-family: 
  'Hiragino Sans', 
  'ヒラギノ角ゴ ProN W3', 
  'Hiragino Kaku Gothic ProN', 
  'メイリオ', 
  'Meiryo', 
  sans-serif;

/* ヘッダー */
.text-h1 { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 1.875rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }

/* ボディ */
.text-body { font-size: 1rem; line-height: 1.6; }
.text-sm { font-size: 0.875rem; line-height: 1.5; }
```

#### コンポーネント仕様

**ボタン**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}
```

**カード**:
```typescript
interface CardProps {
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

### 📱 ユーザビリティ要件

#### ナビゲーション
- **ヘッダー**: ロゴ、メインナビ、検索バー、カートアイコン、ユーザーメニュー
- **フッター**: 会社情報、利用規約、プライバシーポリシー、お問い合わせ
- **パンくずリスト**: 商品詳細・カテゴリページで表示
- **モバイルメニュー**: ハンバーガーメニューによるドロワー型

#### フォーム
- **バリデーション**: リアルタイムバリデーション実装
- **エラー表示**: フィールド下部に赤文字で表示
- **必須項目**: アスタリスク（*）マークで明示
- **プレースホルダー**: 入力例を表示

#### フィードバック
- **ローディング**: スケルトンUI・スピナー表示
- **成功通知**: トースト通知（緑色）
- **エラー通知**: トースト通知（赤色）
- **確認ダイアログ**: 重要な操作前に確認

---

## ⚡ パフォーマンス要件

### 🚀 ページロード時間目標

| ページタイプ | 目標時間 | 許容時間 |
|-------------|---------|---------|
| ホームページ | < 1.5秒 | < 2秒 |
| 商品一覧 | < 2秒 | < 3秒 |
| 商品詳細 | < 1.5秒 | < 2秒 |
| カート・チェックアウト | < 2秒 | < 3秒 |

### 📊 Core Web Vitals目標

| 指標 | 目標値 | 許容値 |
|-----|--------|--------|
| LCP (Largest Contentful Paint) | < 1.2秒 | < 2.5秒 |
| FID (First Input Delay) | < 50ms | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.05 | < 0.1 |

### 🛠️ 最適化戦略

#### SSG最適化
```typescript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // ロリポップ環境では画像最適化を無効化
  },
  experimental: {
    optimizeCss: true,
  }
}
```

#### 画像最適化
- **WebP形式**: モダンブラウザ対応
- **レスポンシブ画像**: 複数サイズ生成
- **遅延読み込み**: スクロール時に画像読み込み
- **プレースホルダー**: ブラー効果付きプレースホルダー

#### バンドル最適化
- **コード分割**: ページ単位・機能単位でのコード分割
- **Tree Shaking**: 未使用コード除去
- **依存関係最適化**: 軽量ライブラリの選択

---

## 🛡️ セキュリティ要件

### 🔐 認証・認可

#### JWT トークン管理
```typescript
// セキュアなトークン保存
const TokenManager = {
  setTokens: (tokens: AuthTokens) => {
    // HttpOnly Cookieでの保存（推奨）
    document.cookie = `access_token=${tokens.access_token}; Secure; SameSite=Strict`
    document.cookie = `refresh_token=${tokens.refresh_token}; Secure; SameSite=Strict`
  },
  
  getAccessToken: (): string | null => {
    // Cookieから取得
    return getCookie('access_token')
  },
  
  clearTokens: () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
```

#### セキュリティヘッダー
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
]
```

### 🛡️ XSS・CSRF対策

#### 入力値サニタイゼーション
```typescript
import DOMPurify from 'dompurify'

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // HTMLタグを全て除去
    ALLOWED_ATTR: []
  })
}
```

#### CSRF対策
- すべてのAPI リクエストにCSRFトークン付与
- SameSite Cookie属性の適用

---

## 📱 レスポンシブ対応

### 📱 ブレークポイント戦略

#### Tailwind CSS ブレークポイント
```css
/* モバイルファースト設計 */
.container {
  @apply px-4;           /* モバイル: 16px */
  @apply sm:px-6;        /* タブレット: 24px */
  @apply lg:px-8;        /* デスクトップ: 32px */
}

/* ブレークポイント */
sm: 640px   /* タブレット */
md: 768px   /* タブレット大 */
lg: 1024px  /* デスクトップ */
xl: 1280px  /* デスクトップ大 */
2xl: 1536px /* ワイドスクリーン */
```

#### レスポンシブレイアウト

**商品グリッド**:
```css
.product-grid {
  @apply grid gap-4;
  @apply grid-cols-2;        /* モバイル: 2列 */
  @apply sm:grid-cols-3;     /* タブレット: 3列 */
  @apply lg:grid-cols-4;     /* デスクトップ: 4列 */
  @apply xl:grid-cols-5;     /* ワイド: 5列 */
}
```

**ナビゲーション**:
```css
.navigation {
  @apply hidden lg:flex;     /* デスクトップのみ表示 */
}

.mobile-menu {
  @apply lg:hidden;          /* モバイル・タブレットのみ表示 */
}
```

### 📐 タッチ操作対応

#### タッチターゲットサイズ
```css
/* 最小タッチサイズ: 44px × 44px */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
  @apply flex items-center justify-center;
}

/* ボタン間隔 */
.button-group {
  @apply space-x-2 space-y-2;
}
```

#### スワイプ操作
- 商品画像ギャラリーでのスワイプ対応
- カルーセルコンポーネントでのスワイプ操作

---

## 🚀 デプロイ要件

### 🌐 ロリポップハイスピードプラン対応

#### 静的サイト生成設定
```typescript
// next.config.js
const nextConfig = {
  output: 'export',              // 静的ファイル出力
  trailingSlash: true,           // URLの末尾にスラッシュ追加
  skipTrailingSlashRedirect: true,
  distDir: 'out',               // 出力ディレクトリ
  images: {
    unoptimized: true,          // 画像最適化無効化
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  experimental: {
    esmExternals: false
  }
}
```

#### ビルド・デプロイフロー
```bash
# ビルドスクリプト
npm run build     # Next.js ビルド実行
npm run export    # 静的ファイル生成

# デプロイ準備
# 1. /out ディレクトリの内容をロリポップにアップロード
# 2. .htaccess 設定（リダイレクト・キャッシュ制御）
# 3. 404ページ設定
```

#### .htaccess 設定
```apache
# キャッシュ制御
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>

# GZIP圧縮
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# SPA用 fallback（必要に応じて）
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 🔄 CI/CD パイプライン提案

#### GitHub Actions
```yaml
name: Deploy to Lolipop
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Lolipop
        uses: SamKirkland/FTP-Deploy-Action@4.3.3
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./out/
```

---

## 📊 SEO要件

### 🔍 メタデータ最適化

#### 基本メタタグ
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'ECサイト - 高品質な商品をお届け',
    template: '%s | ECサイト'
  },
  description: '最新の商品を豊富に取り揃えたECサイト。高品質な商品を全国にお届けします。',
  keywords: ['EC', 'オンラインショップ', '通販', '商品'],
  authors: [{ name: 'ECサイト運営チーム' }],
  creator: 'ECサイト',
  publisher: 'ECサイト',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://your-domain.com',
    siteName: 'ECサイト',
    title: 'ECサイト - 高品質な商品をお届け',
    description: '最新の商品を豊富に取り揃えたECサイト',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ECサイト',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECサイト - 高品質な商品をお届け',
    description: '最新の商品を豊富に取り揃えたECサイト',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}
```

#### 動的メタデータ（商品詳細）
```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image_url || '/default-product.jpg',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  }
}
```

### 🗺️ サイトマップ生成

#### サイトマップ自動生成
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com'
  
  // 商品データ取得
  const products = await getProducts()
  const categories = await getCategories()
  
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
    ...categoryUrls,
  ]
}
```

### 🏷️ 構造化データ

#### JSON-LD 実装
```typescript
// components/StructuredData.tsx
export const ProductStructuredData = ({ product }: { product: Product }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "url": `https://your-domain.com/products/${product.id}`,
      "priceCurrency": "JPY",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "ECサイト"
      }
    },
    "aggregateRating": product.average_rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.average_rating,
      "reviewCount": product.review_count
    } : undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// 組織情報の構造化データ
export const OrganizationStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ECサイト",
    "url": "https://your-domain.com",
    "logo": "https://your-domain.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+81-3-1234-5678",
      "contactType": "customer service",
      "availableLanguage": "Japanese"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

---

## 🧪 テスト要件

### 🔍 テスト戦略

#### テストピラミッド
```
        E2E Tests (5%)
      ┌─────────────────┐
     │ Playwright Tests │
    └─────────────────────┘
      
    Integration Tests (15%)
  ┌─────────────────────────┐
 │ React Testing Library   │
└─────────────────────────────┘

       Unit Tests (80%)
┌───────────────────────────────┐
│ Jest + React Testing Library │
└───────────────────────────────┘
```

#### 単体テスト（Unit Tests）
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/features/ProductCard'
import { mockProduct } from '@/test/mocks'

describe('ProductCard', () => {
  it('商品情報が正しく表示される', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    expect(screen.getByText(`¥${mockProduct.price.toLocaleString()}`)).toBeInTheDocument()
    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument()
  })

  it('在庫切れ商品で「在庫切れ」バッジが表示される', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 }
    render(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText('在庫切れ')).toBeInTheDocument()
  })

  it('注目商品で「注目」バッジが表示される', () => {
    const featuredProduct = { ...mockProduct, is_featured: true }
    render(<ProductCard product={featuredProduct} />)
    
    expect(screen.getByText('注目')).toBeInTheDocument()
  })
})
```

#### 統合テスト（Integration Tests）
```typescript
// __tests__/features/cart.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Cart } from '@/components/features/Cart'
import { server } from '@/test/mocks/server'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Cart Integration', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('商品をカートに追加して数量を変更できる', async () => {
    const user = userEvent.setup()
    render(<Cart />, { wrapper: createWrapper() })

    // カートが空の状態を確認
    expect(screen.getByText('カートに商品がありません')).toBeInTheDocument()

    // 商品追加（モックAPIレスポンスで処理）
    // 実際の実装では商品一覧からカート追加をテスト
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
    })

    // 数量変更
    const increaseButton = screen.getByLabelText('数量を増やす')
    await user.click(increaseButton)

    await waitFor(() => {
      expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    })
  })
})
```

#### E2Eテスト（End-to-End Tests）
```typescript
// e2e/shopping-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('ショッピングフロー', () => {
  test('商品検索から購入まで一連の流れ', async ({ page }) => {
    // ホームページアクセス
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'ECサイト' })).toBeVisible()

    // 商品検索
    await page.getByPlaceholder('商品を検索').fill('iPhone')
    await page.getByRole('button', { name: '検索' }).click()

    // 検索結果確認
    await expect(page.getByText('iPhone 15 Pro')).toBeVisible()

    // 商品詳細ページへ
    await page.getByText('iPhone 15 Pro').click()
    await expect(page.getByRole('heading', { name: 'iPhone 15 Pro' })).toBeVisible()

    // カートに追加
    await page.getByRole('button', { name: 'カートに追加' }).click()
    await expect(page.getByText('カートに追加しました')).toBeVisible()

    // カートページへ
    await page.getByRole('link', { name: 'カート' }).click()
    await expect(page.getByText('ショッピングカート')).toBeVisible()
    await expect(page.getByText('iPhone 15 Pro')).toBeVisible()

    // チェックアウト
    await page.getByRole('button', { name: 'レジに進む' }).click()
    
    // ログインページにリダイレクト（未ログインの場合）
    await expect(page.getByText('ログイン')).toBeVisible()
    
    // ログイン
    await page.getByPlaceholder('メールアドレス').fill('test@example.com')
    await page.getByPlaceholder('パスワード').fill('password')
    await page.getByRole('button', { name: 'ログイン' }).click()

    // チェックアウトページ
    await expect(page.getByText('注文確認')).toBeVisible()
    
    // 配送先情報入力
    await page.getByPlaceholder('郵便番号').fill('100-0001')
    await page.getByPlaceholder('住所').fill('東京都千代田区丸の内1-1-1')
    
    // 注文確定
    await page.getByRole('button', { name: '注文を確定する' }).click()
    await expect(page.getByText('注文が完了しました')).toBeVisible()
  })

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // ハンバーガーメニューが表示される
    await expect(page.getByRole('button', { name: 'メニュー' })).toBeVisible()
    
    // メニューを開く
    await page.getByRole('button', { name: 'メニュー' }).click()
    await expect(page.getByRole('navigation')).toBeVisible()

    // 商品グリッドが2列表示
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible()
  })
})
```

### 📊 テストカバレッジ目標

| 項目 | 目標カバレッジ |
|------|---------------|
| 全体 | 80%以上 |
| コンポーネント | 90%以上 |
| ユーティリティ関数 | 95%以上 |
| API関連 | 85%以上 |

---

## 🔧 開発環境セットアップ

### 📦 必要パッケージ

#### 本体依存関係
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    
    "tailwindcss": "^3.3.0",
    "@tailwindcss/forms": "^0.5.0",
    "@tailwindcss/typography": "^0.5.0",
    
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0",
    "framer-motion": "^10.16.0",
    
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^1.14.0",
    
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

#### 開発依存関係
```json
{
  "devDependencies": {
    "eslint": "^8.52.0",
    "eslint-config-next": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.9.0",
    "@typescript-eslint/parser": "^6.9.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    
    "@playwright/test": "^1.39.0",
    
    "msw": "^1.3.0",
    "@faker-js/faker": "^8.2.0"
  }
}
```

### ⚙️ 設定ファイル

#### Next.js設定
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  
  images: {
    unoptimized: true,
  },
  
  experimental: {
    typedRoutes: true,
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

#### Tailwind CSS設定
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fafaf9',
          500: '#78716c',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: [
          'Hiragino Sans',
          'ヒラギノ角ゴ ProN W3',
          'Hiragino Kaku Gothic ProN',
          'メイリオ',
          'Meiryo',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

#### TypeScript設定
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/store/*": ["./src/store/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🎯 マイルストーン・スケジュール

### 📅 開発フェーズ

#### Phase 1: 基盤構築（2週間）
**Week 1**:
- [ ] プロジェクト初期化・環境構築
- [ ] 基本レイアウト・デザインシステム構築
- [ ] 認証システム実装
- [ ] API統合基盤構築

**Week 2**:
- [ ] 共通コンポーネント開発
- [ ] 状態管理実装
- [ ] ルーティング設定
- [ ] エラーハンドリング実装

#### Phase 2: コア機能実装（3週間）
**Week 3**:
- [ ] ホームページ実装
- [ ] 商品一覧ページ実装
- [ ] 商品詳細ページ実装
- [ ] カテゴリページ実装

**Week 4**:
- [ ] ショッピングカート実装
- [ ] ユーザー認証画面実装
- [ ] マイページ実装
- [ ] 検索機能実装

**Week 5**:
- [ ] チェックアウト機能実装
- [ ] 注文履歴実装
- [ ] レスポンシブ対応
- [ ] パフォーマンス最適化

#### Phase 3: 管理者機能・最終調整（2週間）
**Week 6**:
- [ ] 管理者ダッシュボード実装
- [ ] 商品管理機能実装
- [ ] 注文管理機能実装
- [ ] SEO最適化

**Week 7**:
- [ ] テスト実装・実行
- [ ] バグ修正
- [ ] デプロイ準備
- [ ] 本番環境テスト

### 🎯 成果物・納期

| 項目 | 納期 | 成果物 |
|------|------|--------|
| 基盤構築 | Week 2末 | 認証・共通コンポーネント |
| コア機能 | Week 5末 | 全ユーザー向け機能 |
| 管理者機能 | Week 6末 | 管理画面完成 |
| 最終版 | Week 7末 | 本番デプロイ可能状態 |

---

## 🔗 関連ドキュメント・参考資料

### 📚 技術ドキュメント
- [Next.js 14 公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [React Query 公式ドキュメント](https://tanstack.com/query/latest)
- [React Hook Form 公式ドキュメント](https://react-hook-form.com/)

### 🎨 デザインリソース
- [Headless UI Components](https://headlessui.com/)
- [Heroicons](https://heroicons.com/)
- [Tailwind UI パターン](https://tailwindui.com/)

### 🚀 デプロイ・運用
- [ロリポップ ハイスピードプラン仕様](https://lolipop.jp/service/highspeed/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

### 🧪 テスト・品質管理
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Testing](https://playwright.dev/)
- [Jest Testing Framework](https://jestjs.io/)

---

## ✅ 承認・確認事項

### 🔍 確認必須事項

#### 技術的確認
- [ ] バックエンドAPI（http://localhost:8080/api）との接続確認
- [ ] ロリポップハイスピードプランでのSSG動作確認
- [ ] 必要な技術スタックの承認
- [ ] デザインシステム・UI方針の承認

#### 機能的確認
- [ ] 実装優先順位の確認
- [ ] 管理者機能の詳細要件確認
- [ ] 決済システム連携の要否
- [ ] 在庫管理システムとの連携要件

#### 運用・保守
- [ ] ドメイン・SSL証明書の準備
- [ ] デプロイフロー・権限設定
- [ ] 運用監視・ログ管理要件
- [ ] 保守・アップデート計画

### 📝 次のアクション
1. **要件確認ミーティング**: この要件定義書の内容確認
2. **技術検証**: バックエンドAPI接続テスト
3. **デザインモックアップ**: 主要画面のデザイン作成
4. **開発環境構築**: 開発チーム向け環境準備
5. **プロジェクト開始**: Phase 1開発着手

---

**📞 お問い合わせ**
要件に関するご質問・ご要望がございましたら、開発チームまでお気軽にお声がけください。

**🎉 プロジェクト成功に向けて**
この要件定義書を基に、高品質なECサイトフロントエンドを構築していきましょう！
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ロリポップ本番環境対応のNext.js ECサイトフロントエンド。バックエンドAPI（http://localhost:8080）と連携し、SSG（静的サイト生成）によるパフォーマンス最適化を行う。

## コマンド

### 開発・ビルド
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 静的エクスポート（ロリポップ用）
npm run export

# 型チェック
npm run type-check

# リント
npm run lint

# テスト実行
npm run test

# E2Eテスト
npm run test:e2e

# 依存関係の脆弱性チェック
npm audit
```

### プロジェクト初期化（初回のみ）
```bash
# Next.js プロジェクト作成
npx create-next-app@latest . --typescript --tailwind --eslint --app --import-alias "@/*"

# 必要な依存関係インストール
npm install zustand @tanstack/react-query react-hook-form zod @hookform/resolvers
npm install @headlessui/react @heroicons/react framer-motion
npm install clsx class-variance-authority tailwind-merge date-fns react-hot-toast

# 開発依存関係
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test msw @faker-js/faker prettier-plugin-tailwindcss
```

## アーキテクチャ

### ディレクトリ構造
```
app/                    # Next.js App Router
├── (auth)/            # 認証ページグループ
│   ├── login/
│   └── register/
├── admin/             # 管理画面
│   ├── dashboard/
│   ├── products/
│   └── settings/
├── products/          # 商品ページ
│   └── [id]/
├── cart/              # カート
├── orders/            # 注文履歴
├── globals.css        # グローバルスタイル
├── layout.tsx         # ルートレイアウト
└── page.tsx           # ホームページ

components/            # 再利用可能コンポーネント
├── ui/               # 基本UIコンポーネント
├── forms/            # フォーム専用コンポーネント
├── layout/           # レイアウトコンポーネント
└── features/         # 機能別コンポーネント

lib/                  # ライブラリ・設定
├── api.ts           # API クライアント
├── auth.ts          # 認証管理
├── store.ts         # Zustand ストア
├── utils.ts         # ユーティリティ
└── validations.ts   # Zod スキーマ

hooks/               # カスタムフック
contexts/            # React Context
types/               # TypeScript型定義
constants/           # 定数定義
```

### 状態管理設計
- **認証状態**: Zustand + localStorage（トークン管理）
- **カート状態**: TanStack Query + APIサーバー同期
- **UI状態**: React state（モーダル、ローディング等）
- **フォーム状態**: React Hook Form + Zod

### API通信パターン
- **Base URL**: `http://localhost:8080/api`
- **認証**: JWT Bearer token
- **エラーハンドリング**: 統一レスポンス形式
- **キャッシュ戦略**: TanStack Query（5分キャッシュ）

## 重要な実装パターン

### 認証フロー
```typescript
// 必ずhooks/useAuth.tsを使用
const { user, login, logout, isAuthenticated } = useAuth()

// API呼び出し時のトークン自動付与
const response = await apiClient.getCart() // 自動でBearer token付与
```

### SSG最適化設定
```typescript
// next.config.ts - ロリポップ対応必須設定
export default {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
```

### エラーハンドリング
```typescript
// 統一エラーレスポンス処理
try {
  const result = await apiClient.getProducts()
  if (!result.success) {
    toast.error(result.message)
    return
  }
  // 成功処理
} catch (error) {
  toast.error('予期しないエラーが発生しました')
}
```

## コード規約

### TypeScript
- 厳密な型定義必須（`any`型禁止）
- API レスポンス型は`types/api.ts`に集約
- コンポーネントProps型は必ず定義

### コンポーネント設計
- Server/Client Components適切な分離
- 'use client'は最小限の使用
- 単一責任原則の徹底
- Props型定義必須

### スタイリング
- Tailwind CSS優先使用
- カスタムCSS最小限
- デザインシステム（`components/ui/`）活用
- レスポンシブデザイン必須（モバイルファースト）

### パフォーマンス
- Dynamic Import活用（`React.lazy`）
- 画像最適化（Next.js Image禁止、通常のimg使用）
- バンドルサイズ監視
- Core Web Vitals最適化

## テスト戦略

### 単体テスト
```bash
# コンポーネントテスト
npm run test -- ProductCard.test.tsx

# カスタムフックテスト  
npm run test -- useAuth.test.ts
```

### 統合テスト
```bash
# API連携テスト
npm run test -- cart.integration.test.tsx
```

### E2Eテスト
```bash
# 主要フローテスト
npm run test:e2e -- shopping-flow.spec.ts
```

## 開発ワークフロー

### 新機能開発
1. `types/api.ts`で型定義追加
2. `lib/api.ts`でAPIクライアントメソッド追加
3. カスタムフック作成（`hooks/`）
4. コンポーネント実装（`components/`）
5. ページ実装（`app/`）
6. テスト作成
7. 型チェック＆リント実行

### デプロイ準備
```bash
# ビルド確認
npm run build

# 静的エクスポート
npm run export

# outディレクトリをロリポップにアップロード
```

## トラブルシューティング

### よくある問題

**Hydration エラー**
- Server/Client間の不整合確認
- `suppressHydrationWarning`使用検討

**API接続エラー**
```bash
# バックエンド起動確認
curl http://localhost:8080/api/health

# CORS設定確認（localhost:3000許可済み）
```

**認証エラー**
- トークン有効期限確認（1時間）
- localStorage内容確認
- API レスポンスログ確認

**ビルドエラー**
```bash
# 型エラー確認
npm run type-check

# 依存関係確認
npm ls
```

## 環境設定

### 必須環境変数
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_ENV=development
```

### 開発環境要件
- Node.js 18+
- TypeScript 5+
- バックエンドAPI起動済み（localhost:8080）

## 重要なリファレンス

### バックエンドAPI
- ヘルスチェック: `GET /api/health`
- 認証: `POST /api/auth/login`
- 商品一覧: `GET /api/products`
- カート: `GET /api/cart`（認証必須）

### テストアカウント
```json
// 一般ユーザー
{"email": "test@example.com", "password": "password"}

// 管理者
{"email": "admin@ec-site-dev.local", "password": "password"}
```

### パフォーマンス目標
- First Contentful Paint: < 1.5秒
- Largest Contentful Paint: < 2.5秒
- Core Web Vitals: 全て「良好」

### セキュリティ
- JWT トークンのHttpOnly Cookie保存推奨
- XSS対策（React標準で対応）
- 入力値サニタイゼーション必須
- HTTPS通信必須（本番環境）

## GitHubリポジトリ管理

### MCP を使ったリポジトリ作成・管理
```bash
# GitHubリポジトリの作成（初回のみ）
gh repo create ec-frontend --public --description "ECサイトフロントエンド - Next.js + TypeScript"

# リモートリポジトリの設定
git remote add origin https://github.com/username/ec-frontend.git
git branch -M main
git push -u origin main

# 日常的なGit操作
git add .
git commit -m "feat: 商品一覧機能を実装"
git push

# ブランチ作成（機能開発時）
git checkout -b feature/product-list
git push -u origin feature/product-list

# プルリクエスト作成
gh pr create --title "feat: 商品一覧機能の実装" --body "Issue #X を解決"
```

### 推奨ブランチ戦略
- `main`: 本番デプロイ用（常にデプロイ可能状態）
- `develop`: 開発統合ブランチ
- `feature/機能名`: 機能開発ブランチ
- `fix/修正内容`: バグ修正ブランチ

### コミットメッセージ規約
```bash
# 機能追加
git commit -m "feat: 商品カートに追加機能を実装"

# バグ修正
git commit -m "fix: カート数量更新時のバリデーションエラーを修正"

# UI/スタイル調整
git commit -m "style: ヘッダーナビゲーションのレスポンシブ対応"

# リファクタリング
git commit -m "refactor: API クライアントの型安全性を改善"

# 設定・依存関係
git commit -m "chore: Tailwind CSS とコンポーネントライブラリを追加"

# ドキュメント
git commit -m "docs: API 認証フローの説明を README に追加"
```

## GitHub Issues による進捗管理

### Epic + 子Issue構造での管理
このプロジェクトでは、Epic Issue（親）+ 子Issue の階層構造で進捗を管理する。

### Epic Issue作成
```bash
# Epic Issue作成（プロジェクト全体管理）
gh issue create \
  --title "🚀【Epic】ECサイトフロントエンド開発" \
  --body "$(cat .github/ISSUE_TEMPLATE/epic.md)" \
  --milestone "MVP リリース" \
  --label "epic,priority: high"
```

### Epic Issue テンプレート例
```markdown
# 🚀【Epic】ECサイトフロントエンド開発

## 概要
Next.js + TypeScript によるECサイトフロントエンドの開発。
バックエンドAPI（http://localhost:8080）と連携し、ロリポップでのSSGデプロイを実現。

## 🎯 プロジェクトゴール
- ✅ 商品閲覧・検索機能の実装
- ✅ ユーザー認証・カート機能の実装
- ✅ 注文・決済フローの実装
- ✅ 管理者機能の実装
- ✅ SSG最適化とロリポップデプロイ

## 📋 機能要件リスト（子Issue）

### 🏗️ 基盤設定
- [ ] #TBD [Chore] Next.js プロジェクト初期設定
- [ ] #TBD [Chore] TypeScript・Tailwind・状態管理ライブラリ設定
- [ ] #TBD [Chore] API クライアント基盤実装

### 🎨 認証・ユーザー管理
- [ ] #TBD [Feature] ユーザー認証システム実装
- [ ] #TBD [Feature] ユーザープロフィール管理
- [ ] #TBD [UI] ログイン・登録画面実装

### 🛍️ 商品管理機能
- [ ] #TBD [Feature] 商品一覧・詳細表示機能
- [ ] #TBD [Feature] 商品検索・フィルタリング機能
- [ ] #TBD [Feature] カテゴリ別商品表示

### 🛒 カート・注文機能
- [ ] #TBD [Feature] ショッピングカート機能
- [ ] #TBD [Feature] チェックアウト・注文機能
- [ ] #TBD [Feature] 注文履歴機能

### 👑 管理者機能
- [ ] #TBD [Feature] 管理者ダッシュボード
- [ ] #TBD [Feature] 商品管理機能
- [ ] #TBD [Feature] 注文管理機能

### ✨ 最適化・デプロイ
- [ ] #TBD [Chore] SSG設定とパフォーマンス最適化
- [ ] #TBD [Chore] ロリポップデプロイ設定
- [ ] #TBD [UI/Polish] 最終UI調整

## 🔄 開発フロー
1. **基盤設定** → 2. **認証機能** → 3. **商品機能** → 4. **カート機能** → 5. **管理者機能** → 6. **最適化・デプロイ**
```

### 子Issue作成コマンド
```bash
# 機能実装Issue
gh issue create \
  --title "[Feature] 商品一覧表示機能の実装" \
  --body "$(cat .github/ISSUE_TEMPLATE/feature.md)" \
  --milestone "MVP リリース" \
  --label "feature,frontend,priority: high"

# UI実装Issue
gh issue create \
  --title "[UI] 商品カードコンポーネント実装" \
  --body "$(cat .github/ISSUE_TEMPLATE/ui.md)" \
  --milestone "MVP リリース" \
  --label "ui,frontend,priority: medium"

# 設定・環境構築Issue  
gh issue create \
  --title "[Chore] TanStack Query設定と状態管理基盤" \
  --body "$(cat .github/ISSUE_TEMPLATE/chore.md)" \
  --milestone "MVP リリース" \
  --label "chore,priority: high"
```

### 推奨ラベル体系
```bash
# GitHub CLIでラベル作成
gh label create "epic" --color "8B5CF6" --description "プロジェクト全体管理"
gh label create "feature" --color "10B981" --description "新機能実装"
gh label create "ui" --color "F59E0B" --description "UIコンポーネント・レイアウト"
gh label create "chore" --color "6B7280" --description "設定・環境構築"
gh label create "bug" --color "EF4444" --description "バグ修正"
gh label create "frontend" --color "EC4899" --description "フロントエンド"
gh label create "priority: high" --color "DC2626" --description "高優先度"
gh label create "priority: medium" --color "F59E0B" --description "中優先度"
gh label create "priority: low" --color "10B981" --description "低優先度"
gh label create "in-progress" --color "3B82F6" --description "作業中"
gh label create "testing" --color "8B5CF6" --description "テスト中"
gh label create "blocked" --color "DC2626" --description "ブロック状態"
```

### Issue管理フロー
1. **Epic Issue作成**: プロジェクト開始時に全体管理用Epic作成
2. **子Issue作成**: 機能ごとに具体的なタスクを子Issueとして作成
3. **定期更新**: 日次で進捗状況をIssueコメントで更新
4. **完了報告**: 実装完了時に動作確認結果を報告
5. **Epic更新**: 子Issue完了時にEpic Issueのチェックリストを更新

### Issue作成時の必須要素
- **明確な目的**: 何を実装するかを1-2行で記述
- **具体的なタスクリスト**: チェックボックス形式での詳細作業
- **完了条件**: 何をもって完了とするかを明確化
- **関連資料**: 要件定義書・API仕様書への参照
- **実装ヒント**: コード例やパターンの記載

### 進捗報告例
```markdown
## 📊 進捗報告（2025-08-20）

### ✅ 完了
- ✅ Next.js プロジェクト初期設定
- ✅ TypeScript・Tailwind CSS設定
- ✅ API クライアント基盤実装

### 🔄 作業中
- 🔄 商品一覧コンポーネント実装（80%完了）
- 🔄 認証フック実装（50%完了）

### 📅 次回予定
- 📅 商品詳細ページ実装
- 📅 カート機能の基盤実装

### ⚠️ ブロッカー・課題
- なし（順調に進行中）
```

このプロジェクトは要件定義書（ec-frontend-requirements.md）とAPI仕様書（ec-frontend-dev.md）に基づいて開発を進める。GitHub Issues による進捗管理とMCPを活用したリポジトリ管理により、透明性の高い開発プロセスを実現する。実装時は常にパフォーマンス・セキュリティ・アクセシビリティを考慮すること。
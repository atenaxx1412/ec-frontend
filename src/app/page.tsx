import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'ホーム',
  description: 'EC Siteのホームページ。最新商品や注目商品をご紹介します。',
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ヒーローセクション */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          EC Site
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          高品質な商品を豊富に取り揃えたオンラインショップ
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/products">
            <Button variant="primary" size="lg">
              商品を見る
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="lg">
              新規登録
            </Button>
          </Link>
        </div>
      </div>

        {/* 機能セクション */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                豊富な商品ラインナップ
              </h3>
              <p className="mt-2 text-gray-600">
                エレクトロニクスからファッションまで、幅広いカテゴリの商品を取り揃えています。
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                安全・安心なお買い物
              </h3>
              <p className="mt-2 text-gray-600">
                セキュアな決済システムと迅速な配送で、安心してお買い物をお楽しみいただけます。
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                カスタマーサポート
              </h3>
              <p className="mt-2 text-gray-600">
                ご質問やお困りごとがございましたら、お気軽にお問い合わせください。
              </p>
            </div>
          </div>
        </div>

        {/* 開発状況 */}
        <div className="mt-20 rounded-lg bg-blue-50 p-6">
          <h2 className="text-xl font-semibold text-blue-900">
            🚧 開発中のサイトです
          </h2>
          <p className="mt-2 text-blue-700">
            現在、Next.js + TypeScript を使用してECサイトを開発中です。
            バックエンドAPI（localhost:8080）との連携機能を順次実装中です。
          </p>
          <div className="mt-4">
            <p className="text-sm text-blue-600">
              ✅ Next.js 14 + TypeScript 基盤構築完了<br/>
              ✅ APIクライアント・認証基盤完了<br/>
              ✅ ログイン・登録機能完了<br/>
              🔄 商品一覧・詳細機能 開発予定<br/>
              📅 カート・注文機能 予定<br/>
              📅 管理者機能 予定
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <Link href="/auth/login">
              <Button variant="secondary" size="sm">
                ログイン機能を試す
              </Button>
            </Link>
            <Link href="/api-test">
              <Button variant="ghost" size="sm">
                API接続テスト
              </Button>
            </Link>
          </div>
        </div>
    </div>
  );
}
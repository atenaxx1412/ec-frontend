'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function APITestPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, user, isAuthenticated } = useAuth();

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const startTime = Date.now();
      const result = await testFn();
      const endTime = Date.now();
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          data: result,
          duration: endTime - startTime,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const tests = {
    healthCheck: () => runTest('ヘルスチェック', () => apiClient.healthCheck()),
    getProducts: () => runTest('商品一覧取得', () => apiClient.getProducts({ limit: 3 })),
    getCategories: () => runTest('カテゴリ一覧取得', () => apiClient.getCategories(true)),
    userLogin: () => runTest('ユーザーログイン', async () => {
      const result = await login({ 
        email: 'test@example.com', 
        password: 'password' 
      });
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      return result;
    }),
    getCart: () => runTest('カート取得', () => apiClient.getCart()),
    adminLogin: () => runTest('管理者ログイン', () => 
      apiClient.adminLogin({
        email: 'admin@ec-site-dev.local',
        password: 'password'
      })
    ),
  };

  const renderResult = (testName: string, result: any) => {
    if (!result) return null;

    return (
      <div key={testName} className="mb-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{testName}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm ${
              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {result.success ? '成功' : '失敗'}
            </span>
            {result.duration && (
              <span className="text-sm text-gray-500">{result.duration}ms</span>
            )}
          </div>
        </div>
        
        {result.success ? (
          <div className="text-sm">
            <p className="text-green-600 mb-2">✅ テスト成功</p>
            <details className="bg-gray-50 p-2 rounded">
              <summary className="cursor-pointer">レスポンス詳細</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div className="text-sm">
            <p className="text-red-600">❌ エラー: {result.error}</p>
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-2">
          実行時刻: {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API接続テスト
          </h1>
          <p className="text-gray-600">
            バックエンドAPI（http://localhost:8080）との接続をテストします。
          </p>
        </div>

        {/* 認証状態表示 */}
        <div className="mb-8 p-4 bg-white rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">認証状態</h2>
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600">✅ ログイン済み</p>
                <p className="text-sm text-gray-600">
                  ユーザー: {user?.name} ({user?.email})
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <p className="text-gray-600">❌ 未ログイン</p>
          )}
        </div>

        {/* テストボタン */}
        <div className="mb-8 p-4 bg-white rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">APIテスト</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={tests.healthCheck}
              disabled={isLoading}
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              ヘルスチェック
            </button>
            <button
              onClick={tests.getProducts}
              disabled={isLoading}
              className="p-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              商品一覧取得
            </button>
            <button
              onClick={tests.getCategories}
              disabled={isLoading}
              className="p-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              カテゴリ取得
            </button>
            <button
              onClick={tests.userLogin}
              disabled={isLoading || isAuthenticated}
              className="p-3 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              ユーザーログイン
            </button>
            <button
              onClick={tests.getCart}
              disabled={isLoading || !isAuthenticated}
              className="p-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              カート取得
            </button>
            <button
              onClick={tests.adminLogin}
              disabled={isLoading}
              className="p-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              管理者ログイン
            </button>
          </div>
          
          {isLoading && (
            <div className="mt-4 text-center">
              <span className="text-blue-600">🔄 実行中...</span>
            </div>
          )}
        </div>

        {/* テスト結果表示 */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">テスト結果</h2>
          </div>
          <div className="p-4">
            {Object.keys(testResults).length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                テストを実行してください
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(testResults).map(([testName, result]) => 
                  renderResult(testName, result)
                )}
              </div>
            )}
          </div>
        </div>

        {/* API接続ガイド */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            📋 テスト手順
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. バックエンドサーバー（localhost:8080）が起動していることを確認</li>
            <li>2. 「ヘルスチェック」でサーバー接続を確認</li>
            <li>3. 「商品一覧取得」で公開APIをテスト</li>
            <li>4. 「ユーザーログイン」で認証をテスト</li>
            <li>5. 「カート取得」で認証が必要なAPIをテスト</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
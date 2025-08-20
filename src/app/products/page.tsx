'use client';

import { useState, useEffect, useCallback } from 'react';
import { Metadata } from 'next';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { apiClient } from '@/lib/api';
import type { Product, Category, ProductSearchParams, PaginationInfo } from '@/types';

// ページメタデータ（静的）
// export const metadata: Metadata = {
//   title: '商品一覧 | EC Site',
//   description: '豊富な商品ラインナップからお気に入りの商品を見つけてください。',
// };

/**
 * 商品一覧ページ
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductSearchParams>({
    page: 1,
    limit: 12,
    sort: 'created_at',
    order: 'desc',
  });

  // カテゴリデータを取得
  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.getCategories(true);
      
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // 商品データを取得
  const fetchProducts = useCallback(async (searchParams: ProductSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.getProducts(searchParams);
      
      if (response.success && response.data) {
        setProducts(response.data);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || '商品の取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(error instanceof Error ? error.message : '商品の取得に失敗しました');
      setProducts([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初期データ取得
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // フィルター変更時の商品取得
  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  // フィルター変更ハンドラー
  const handleFiltersChange = (newFilters: ProductSearchParams) => {
    setFilters(newFilters);
  };

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    // ページ変更時にトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // カートに追加ハンドラー
  const handleAddToCart = async (productId: number) => {
    try {
      // TODO: カート機能実装時にAPIコールを追加
      console.log('Add to cart:', productId);
      
      // 一時的なフィードバック
      alert('カートに追加しました！（カート機能は次のフェーズで実装予定）');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('カートへの追加に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">商品一覧</h1>
            <p className="mt-2 text-gray-600">
              豊富な商品ラインナップからお気に入りの商品を見つけてください
            </p>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <ProductFilters
        categories={categories}
        currentFilters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 結果サマリー */}
        {!isLoading && pagination && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {pagination.total}件中 {((pagination.current_page - 1) * pagination.per_page) + 1}-
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}件を表示
            </p>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  エラーが発生しました
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => fetchProducts(filters)}
                  className="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 商品グリッド */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
          emptyMessage={
            Object.keys(filters).length > 2 
              ? "検索条件に一致する商品が見つかりませんでした。"
              : "商品が登録されていません。"
          }
        />

        {/* ページネーション */}
        {pagination && pagination.total_pages > 1 && (
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.per_page}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* 開発状況表示 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                開発中の機能
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                現在はサンプルデータで表示しています。実際のバックエンドAPI（localhost:8080）との連携は次のフェーズで実装予定です。
                カート機能も含めて順次開発していきます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
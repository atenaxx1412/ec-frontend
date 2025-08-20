'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { Category, ProductSearchParams } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  currentFilters: ProductSearchParams;
  onFiltersChange: (filters: ProductSearchParams) => void;
  isLoading?: boolean;
}

/**
 * 商品フィルター・検索コンポーネント
 */
export function ProductFilters({
  categories,
  currentFilters,
  onFiltersChange,
  isLoading = false,
}: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(currentFilters.q || '');
  const [minPrice, setMinPrice] = useState(currentFilters.min_price?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.max_price?.toString() || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onFiltersChange({
      ...currentFilters,
      q: searchQuery.trim() || undefined,
      page: 1, // 検索時はページをリセット
    });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    onFiltersChange({
      ...currentFilters,
      category_id: categoryId,
      page: 1,
    });
  };

  const handleSortChange = (sort: string, order: string) => {
    onFiltersChange({
      ...currentFilters,
      sort: sort as any,
      order: order as any,
      page: 1,
    });
  };

  const handlePriceFilter = () => {
    const minPriceNum = minPrice ? parseInt(minPrice) : undefined;
    const maxPriceNum = maxPrice ? parseInt(maxPrice) : undefined;

    onFiltersChange({
      ...currentFilters,
      min_price: minPriceNum,
      max_price: maxPriceNum,
      page: 1,
    });
  };

  const handleFeaturedFilter = (featured: boolean) => {
    onFiltersChange({
      ...currentFilters,
      featured: featured || undefined,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    currentFilters.q ||
    currentFilters.category_id ||
    currentFilters.min_price ||
    currentFilters.max_price ||
    currentFilters.featured
  );

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* 検索バー */}
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="商品を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pr-10"
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              フィルター
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* フィルター詳細 */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* カテゴリフィルター */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリ
                  </label>
                  <select
                    value={currentFilters.category_id || ''}
                    onChange={(e) => handleCategoryChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="">すべてのカテゴリ</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 価格フィルター */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    価格範囲
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="最小"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                    <span className="text-gray-500 flex items-center">〜</span>
                    <Input
                      type="number"
                      placeholder="最大"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handlePriceFilter}
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    disabled={isLoading}
                  >
                    適用
                  </Button>
                </div>

                {/* 並び替え */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    並び替え
                  </label>
                  <select
                    value={`${currentFilters.sort || 'created_at'}-${currentFilters.order || 'desc'}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split('-');
                      handleSortChange(sort, order);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="created_at-desc">新着順</option>
                    <option value="price-asc">価格の安い順</option>
                    <option value="price-desc">価格の高い順</option>
                    <option value="name-asc">商品名順</option>
                  </select>
                </div>

                {/* その他フィルター */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    その他
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentFilters.featured || false}
                        onChange={(e) => handleFeaturedFilter(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-sm text-gray-700">おすすめ商品のみ</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* フィルターアクション */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                  >
                    フィルターをクリア
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* アクティブフィルタータグ */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {currentFilters.q && (
                <FilterTag
                  label={`検索: "${currentFilters.q}"`}
                  onRemove={() => onFiltersChange({ ...currentFilters, q: undefined })}
                />
              )}
              {currentFilters.category_id && (
                <FilterTag
                  label={`カテゴリ: ${categories.find(c => c.id === currentFilters.category_id)?.name}`}
                  onRemove={() => onFiltersChange({ ...currentFilters, category_id: undefined })}
                />
              )}
              {(currentFilters.min_price || currentFilters.max_price) && (
                <FilterTag
                  label={`価格: ¥${currentFilters.min_price || 0} - ¥${currentFilters.max_price || '∞'}`}
                  onRemove={() => onFiltersChange({ 
                    ...currentFilters, 
                    min_price: undefined, 
                    max_price: undefined 
                  })}
                />
              )}
              {currentFilters.featured && (
                <FilterTag
                  label="おすすめ商品"
                  onRemove={() => onFiltersChange({ ...currentFilters, featured: undefined })}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * フィルタータグコンポーネント
 */
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
      {label}
      <button
        onClick={onRemove}
        className="text-blue-600 hover:text-blue-800"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
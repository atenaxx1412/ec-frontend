'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  showActions?: boolean;
}

/**
 * 商品カードコンポーネント
 */
export function ProductCard({ 
  product, 
  onAddToCart, 
  showActions = true 
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product.id);
  };

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const displayPrice = product.sale_price || product.price;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* 商品画像 */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.id}`}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>

        {/* バッジ類 */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
          {product.is_featured === 1 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              おすすめ
            </span>
          )}
          {product.stock_quantity === 0 && (
            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
              在庫切れ
            </span>
          )}
        </div>

        {/* お気に入りボタン */}
        <button className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white">
          <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* 商品情報 */}
      <div className="p-4">
        {/* カテゴリ */}
        <div className="text-xs text-gray-500 mb-1">
          {product.category.name}
        </div>

        {/* 商品名 */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* 価格 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ¥{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ¥{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* レビュー */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.average_rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.average_rating?.toFixed(1)} ({product.review_count})
            </span>
          </div>
        )}

        {/* アクション */}
        {showActions && (
          <div className="space-y-2">
            {product.stock_quantity > 0 ? (
              <Button
                onClick={handleAddToCart}
                className="w-full"
                size="sm"
              >
                カートに追加
              </Button>
            ) : (
              <Button
                disabled
                className="w-full"
                size="sm"
                variant="secondary"
              >
                在庫切れ
              </Button>
            )}
            
            <Link href={`/products/${product.id}`} className="block">
              <Button
                variant="outline"
                className="w-full"
                size="sm"
              >
                詳細を見る
              </Button>
            </Link>
          </div>
        )}

        {/* 在庫情報 */}
        {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
          <div className="mt-2 text-xs text-orange-600">
            残り{product.stock_quantity}個
          </div>
        )}
      </div>
    </div>
  );
}
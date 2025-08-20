'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { apiClient } from '@/lib/api';
import type { Product } from '@/types';

/**
 * 商品詳細ページ
 */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // 関連商品を取得
  const fetchRelatedProducts = useCallback(async (categoryId: number) => {
    try {
      const response = await apiClient.getProducts({
        category_id: categoryId,
        limit: 4,
      });
      
      if (response.success && response.data) {
        // 現在の商品を除外
        const filtered = response.data.filter(p => p.id !== productId);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  }, [productId]);

  // 商品詳細データを取得
  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.getProduct(productId);
      
      if (response.success && response.data) {
        setProduct(response.data);
        // 関連商品も取得
        fetchRelatedProducts(response.data.category.id);
      } else {
        throw new Error(response.message || '商品の取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError(error instanceof Error ? error.message : '商品の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [productId, fetchRelatedProducts]);

  // カートに追加
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      
      // TODO: カート機能実装時にAPIコールを追加
      console.log('Add to cart:', product.id, 'quantity:', quantity);
      
      // 一時的なフィードバック
      alert(`${product.name} を ${quantity}個 カートに追加しました！`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('カートへの追加に失敗しました');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // 数量変更
  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">商品が見つかりません</h3>
          <p className="mt-1 text-sm text-gray-500">{error || '指定された商品は存在しません。'}</p>
          <div className="mt-6">
            <Link href="/products">
              <Button variant="primary">
                商品一覧に戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;
  const displayPrice = product.sale_price || product.price;

  // サンプル画像（実際の実装では商品の複数画像を使用）
  const images = product.image_url 
    ? [product.image_url, product.image_url, product.image_url] 
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* パンくずナビ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ホーム
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">
              商品一覧
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href={`/products?category_id=${product.category.id}`} className="text-gray-500 hover:text-gray-700">
              {product.category.name}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 商品詳細 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 商品画像 */}
          <div>
            {/* メイン画像 */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* サムネイル */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 商品情報 */}
          <div>
            {/* カテゴリとSKU */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm text-blue-600 font-medium">{product.category.name}</span>
              <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            </div>

            {/* 商品名 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* 価格 */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ¥{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ¥{product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* レビュー */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
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
                  {product.average_rating?.toFixed(1)} ({product.review_count}件のレビュー)
                </span>
              </div>
            )}

            {/* 商品説明 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">商品説明</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || product.short_description || '商品説明がありません。'}
              </p>
            </div>

            {/* 在庫状況 */}
            <div className="mb-6">
              {product.stock_quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600 font-medium">在庫あり</span>
                  {product.stock_quantity <= 10 && (
                    <span className="text-orange-600 text-sm">
                      （残り{product.stock_quantity}個）
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-red-600 font-medium">在庫切れ</span>
                </div>
              )}
            </div>

            {/* 数量選択・カート追加 */}
            {product.stock_quantity > 0 && (
              <div className="mb-8">
                {/* 数量選択 */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">数量:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* カート追加ボタン */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    isLoading={isAddingToCart}
                    className="flex-1"
                    size="lg"
                  >
                    カートに追加
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="p-3"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}

            {/* 商品詳細情報 */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">商品詳細</h3>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                {product.weight && (
                  <>
                    <dt className="text-gray-500">重量:</dt>
                    <dd className="text-gray-900">{product.weight}g</dd>
                  </>
                )}
                {product.dimensions && (
                  <>
                    <dt className="text-gray-500">サイズ:</dt>
                    <dd className="text-gray-900">{product.dimensions}</dd>
                  </>
                )}
                <dt className="text-gray-500">カテゴリ:</dt>
                <dd className="text-gray-900">{product.category.name}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* 関連商品 */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">関連商品</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 商品詳細スケルトン（ローディング表示）
 */
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
          {/* 画像スケルトン */}
          <div>
            <div className="aspect-square bg-gray-300 rounded-lg mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-300 rounded-lg" />
              ))}
            </div>
          </div>

          {/* 情報スケルトン */}
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
            <div className="h-10 bg-gray-300 rounded w-40 mb-6" />
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-300 rounded w-full" />
              <div className="h-4 bg-gray-300 rounded w-full" />
              <div className="h-4 bg-gray-300 rounded w-2/3" />
            </div>
            <div className="h-12 bg-gray-300 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';

/**
 * フッターコンポーネント
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 会社情報 */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">EC Site</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                高品質な商品を手頃な価格でお届けする、信頼のオンラインショッピングサイトです。
                お客様のニーズに合わせた豊富な商品ラインナップをご用意しています。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.007 0C5.348 0 0 5.348 0 12.007 0 18.665 5.348 24.013 12.007 24.013S24.013 18.665 24.013 12.007C24.013 5.348 18.665.001 12.007.001zM18.893 9.405c.002.19.002.381.002.571 0 5.834-4.44 12.566-12.564 12.566-2.495 0-4.816-.734-6.774-1.985.347.041.698.061 1.057.061 2.079 0 3.992-.708 5.52-1.898-1.944-.037-3.583-1.32-4.149-3.083.271.052.549.081.834.081.404 0 .796-.055 1.169-.156-2.031-.408-3.564-2.203-3.564-4.355v-.057c.599.333 1.284.534 2.012.557-1.192-.797-1.977-2.158-1.977-3.701 0-.814.219-1.579.602-2.234 2.189 2.689 5.463 4.456 9.161 4.641-.076-.331-.116-.676-.116-1.03 0-2.495 2.021-4.517 4.516-4.517 1.299 0 2.473.549 3.297 1.427.931-.183 1.808-.523 2.596-.992-.305.955-.954 1.756-1.8 2.264.827-.099 1.615-.318 2.348-.643-.548.818-1.242 1.536-2.041 2.111z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* 商品・サービス */}
            <div>
              <h4 className="text-lg font-semibold mb-4">商品・サービス</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                    商品一覧
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                    カテゴリ
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="text-gray-300 hover:text-white transition-colors">
                    セール商品
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="text-gray-300 hover:text-white transition-colors">
                    新着商品
                  </Link>
                </li>
                <li>
                  <Link href="/recommended" className="text-gray-300 hover:text-white transition-colors">
                    おすすめ商品
                  </Link>
                </li>
              </ul>
            </div>

            {/* サポート */}
            <div>
              <h4 className="text-lg font-semibold mb-4">サポート</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                    よくある質問
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                    配送について
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                    返品・交換
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors">
                    サイズガイド
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-wrap justify-center md:justify-start space-x-6 mb-4 md:mb-0">
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  利用規約
                </Link>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  プライバシーポリシー
                </Link>
                <Link href="/legal" className="text-gray-300 hover:text-white transition-colors text-sm">
                  特定商取引法に基づく表記
                </Link>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Cookie ポリシー
                </Link>
              </div>
              <div className="text-gray-300 text-sm">
                © {currentYear} EC Site. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar, Footer } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EC Site - 高品質な商品をお届け',
    template: '%s | EC Site',
  },
  description: '最新の商品を豊富に取り揃えたECサイト。高品質な商品を全国にお届けします。',
  keywords: ['EC', 'オンラインショップ', '通販', '商品'],
  authors: [{ name: 'EC Site運営チーム' }],
  creator: 'EC Site',
  publisher: 'EC Site',
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
    siteName: 'EC Site',
    title: 'EC Site - 高品質な商品をお届け',
    description: '最新の商品を豊富に取り揃えたECサイト',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EC Site',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EC Site - 高品質な商品をお届け',
    description: '最新の商品を豊富に取り揃えたECサイト',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
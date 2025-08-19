import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ECサイト - 高品質な商品をお届け',
    template: '%s | ECサイト',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
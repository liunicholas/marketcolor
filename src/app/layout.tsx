import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | MarketColor',
    default: 'MarketColor - AI-Powered Stock Research',
  },
  description:
    'Free stock research platform with AI-powered analysis, real-time quotes, and professional charts. Get comprehensive market insights powered by GPT-5.',
  keywords: [
    'stocks',
    'investing',
    'AI analysis',
    'stock research',
    'market data',
    'financial analysis',
  ],
  authors: [{ name: 'MarketColor' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MarketColor',
    title: 'MarketColor - AI-Powered Stock Research',
    description:
      'Free stock research platform with AI-powered analysis, real-time quotes, and professional charts.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketColor - AI-Powered Stock Research',
    description:
      'Free stock research platform with AI-powered analysis, real-time quotes, and professional charts.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            {/* Background Pattern */}
            <div className="fixed inset-0 grid-pattern pointer-events-none" />
            <div className="fixed inset-0 noise-overlay pointer-events-none" />

            {/* Content */}
            <Header />
            <main className="flex-1 relative">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

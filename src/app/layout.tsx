
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from '@/context/AppProviders';
import AppHeader from '@/components/AppHeader'; // Corrected import path

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopSwift',
  description: 'A simple e-commerce application for buying and selling products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        suppressHydrationWarning={true}
      >
        <AppProviders>
          <AppHeader />
          <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-150px)]"> {/* Adjusted min-height */}
            {children}
          </main>
          <footer className="bg-card py-6 text-center text-muted-foreground border-t">
            <p>&copy; {new Date().getFullYear()} ShopSwift. All rights reserved.</p>
          </footer>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

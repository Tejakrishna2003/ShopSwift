
// Removed "use client"; RootLayout is now a Server Component by default

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from '@/context/AppProviders';
import AppHeader from '@/components/AppHeader';
import DynamicFooterYear from '@/components/DynamicFooterYear'; // Import the new component
// Removed useState, useEffect imports

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Static metadata can be exported from Server Component layouts
export const metadata: Metadata = {
  title: 'ShopSwift',
  description: 'A simple e-commerce application for buying and selling products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed useState and useEffect for dynamicYear

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        suppressHydrationWarning={true} // Keep this for extension attributes on body
      >
        <AppProviders>
          <AppHeader />
          <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-150px)]"> {/* Adjusted min-height */}
            {children}
          </main>
          <footer className="bg-card py-6 text-center text-muted-foreground border-t">
            <p>&copy; <DynamicFooterYear /> ShopSwift. All rights reserved.</p> {/* Use the new component */}
          </footer>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

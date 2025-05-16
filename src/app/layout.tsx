
// RootLayout is now a Server Component by default

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from '@/context/AppProviders';
import AppHeader from '@/components/AppHeader';
import DynamicFooterYear from '@/components/DynamicFooterYear'; // Import the new component
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Github, Rss, Mail, MessageSquare, Phone, Navigation, MapPin, ShoppingCart, CreditCard, Gift, HelpCircle, InfoIcon, ShieldCheck, Users, Briefcase, BookOpen, Globe, FileText, Sparkles } from 'lucide-react'; // Added more icons

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

const footerLinkGroups = [
  {
    title: "SHOP",
    links: [
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Collections", href: "/products?filter=collections" },
      { label: "Accessories", href: "/products?category=accessories" },
      { label: "Shoes", href: "/products?category=shoes" },
      { label: "Inspiration", href: "/blog/inspiration" },
      { label: "Brands", href: "/brands" },
      { label: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "POPULAR",
    links: [
      { label: "Seasonal Favorites", href: "/products?filter=seasonal" },
      { label: "Must-Have Bags", href: "/products?category=accessories&filter=bags" },
      { label: "Cozy Knitwear", href: "/products?category=clothes&filter=knitwear" },
      { label: "Trendy Accessories", href: "/products?category=accessories&filter=trendy" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Account", href: "/auth" },
      { label: "Store Locations", href: "/stores" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    title: "INFO",
    links: [
      { label: "About", href: "/about" },
      { label: "Career", href: "/careers" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Investor Relations", href: "/investors" },
      { label: "Press", href: "/press" },
    ],
  },
];

const paymentMethods = [
  { name: "VISA", icon: <CreditCard size={24} /> },
  { name: "Apple Pay", icon: <CreditCard size={24} /> }, // Placeholder icon
  { name: "Google Pay", icon: <CreditCard size={24} /> }, // Placeholder icon
  { name: "Klarna", icon: <CreditCard size={24} /> }, // Placeholder icon
  { name: "Mastercard", icon: <CreditCard size={24} /> }, // Placeholder icon
  { name: "PayPal", icon: <CreditCard size={24} /> }, // Placeholder icon
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: <Facebook size={20} /> },
  { name: "Instagram", href: "https://instagram.com", icon: <Instagram size={20} /> },
  { name: "Pinterest", href: "https://pinterest.com", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c0-2.209-1.791-4-4-4s-4 1.791-4 4c0 1.481.811 2.772 2 3.444V12M12 12c0-2.209 1.791-4 4-4s4 1.791 4 4c0 1.481-.811 2.772-2 3.444V12M12 12v10M4 16h16"/></svg> }, // Simple Pin icon
  { name: "TikTok", href: "https://tiktok.com", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z"></path><path d="M12 15V9"></path><path d="M9 9h6"></path></svg> }, // Simple TikTok like icon
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <AppProviders>
          <AppHeader />
          <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </main>
          
          <footer className="bg-card text-card-foreground border-t">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                {footerLinkGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{group.title}</h3>
                    <ul className="space-y-2">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-10">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                  {paymentMethods.map((method) => (
                    <div key={method.name} className="flex items-center gap-1 p-2 border border-border rounded-md text-muted-foreground text-xs" title={method.name}>
                      {method.icon}
                      <span className="hidden sm:inline">{method.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center md:justify-start items-center gap-4">
                  {socialLinks.map((social) => (
                    <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={social.name}>
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; <DynamicFooterYear /> ShopSwift. All rights reserved.</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 md:mt-0">
                  <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
                  <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-primary transition-colors">Terms and Conditions</Link>
                  <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
                </div>
                <p className="mt-4 md:mt-0">Denmark</p> {/* Placeholder for country */}
              </div>
            </div>
          </footer>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

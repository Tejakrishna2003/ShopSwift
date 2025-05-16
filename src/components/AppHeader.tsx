"use client";

import Link from "next/link";
import { ShoppingCart, User as UserIcon, LogIn, LogOut, PackagePlus, SearchIcon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const AppHeader = () => {
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart className="h-7 w-7" />
          ShopSwift
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Home size={16} /> Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <SearchIcon size={16} /> Products
          </Link>
          {user?.role === "seller" && (
            <Link href="/seller/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
              <PackagePlus size={16} /> My Products
            </Link>
          )}
          <Link href="/cart" className="relative flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-3 px-1.5 py-0.5 text-xs">
                {itemCount}
              </Badge>
            )}
            <span className="ml-1 hidden md:inline">Cart</span>
          </Link>
          {isLoading ? (
             <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden md:inline">Hi, {user.name || user.email.split('@')[0]}!</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut size={16} /> Logout
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" asChild className="flex items-center gap-1">
              <Link href="/auth">
                <LogIn size={16} /> Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;

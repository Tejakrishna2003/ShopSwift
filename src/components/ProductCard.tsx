
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Tag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast"; // Added for wishlist toast
import { useRouter } from "next/navigation"; // Added for wishlist redirect

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast(); // For wishlist
  const router = useRouter(); // For wishlist

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent link navigation when clicking button
    e.preventDefault();
    addToCart(product);
  };

  // Placeholder for wishlist functionality - This is a simplified version for the card
  // A proper implementation would use a WishlistContext
  const handleQuickAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
        toast({
            title: "Login Required",
            description: "Please login to add items to your wishlist.",
            variant: "destructive",
        });
        router.push("/auth?tab=login");
        return;
    }
    // In a real app, this would interact with a WishlistContext
    toast({
      title: "Added to Wishlist (Demo)",
      description: `${product.name} would be added to your wishlist. Full functionality on product page.`,
    });
  };

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <Card className="overflow-hidden shadow-lg flex flex-col h-full group transition-all duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full focus:outline-none" aria-label={`View details for ${product.name}`}>
        <CardHeader className="p-0 relative">
          <Image
            src={product.imageUrl || "https://placehold.co/600x400.png"}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={`${product.category} item`}
          />
          {product.discount && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1">
              <Tag size={14} /> {product.discount}% OFF
            </div>
          )}
          {/* Simplified Wishlist Toggle for Card - Full logic on detail page */}
          {user?.role !== "seller" && (
             <Button
                variant="ghost"
                size="icon"
                onClick={handleQuickAddToWishlist}
                className="absolute top-2 left-2 bg-card/70 hover:bg-card text-primary rounded-full h-8 w-8"
                aria-label="Add to wishlist"
              >
                <Heart size={18} />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg mb-1 truncate group-hover:text-primary" title={product.name}>{product.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2 capitalize">{product.category}</CardDescription>
          <p className="text-sm text-foreground/80 mb-3 line-clamp-3" title={product.description}>{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between mt-auto">
          <div>
            {product.discount ? (
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-primary">${discountedPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
            )}
          </div>
          {user?.role !== "seller" && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAddToCart} 
              className="mt-2 sm:mt-0 w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;

"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <Card className="overflow-hidden shadow-lg flex flex-col h-full group transition-all duration-300 hover:shadow-xl">
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
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate" title={product.name}>{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 capitalize">{product.category}</CardDescription>
        <p className="text-sm text-foreground/80 mb-3 line-clamp-3" title={product.description}>{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
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
        {user?.role !== "seller" && ( // Sellers typically don't add their own products to cart
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleAddToCart} 
            className="mt-2 sm:mt-0 w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;


"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mockProducts, productCategories } from "@/lib/mockData";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Tag, ArrowLeft, AlertCircle, CheckCircle, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { productId } = params;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const foundProduct = mockProducts.find((p) => p.id === productId);
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };
  
  // Placeholder for wishlist functionality
  const [isInWishlist, setIsInWishlist] = useState(false);
  const handleToggleWishlist = () => {
    if (!user) {
        toast({
            title: "Login Required",
            description: "Please login to add items to your wishlist.",
            variant: "destructive",
        });
        router.push("/auth?tab=login");
        return;
    }
    setIsInWishlist(!isInWishlist); // Toggle state
    toast({
        title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
        description: product?.name + (isInWishlist ? " removed from your wishlist." : " added to your wishlist."),
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/wishlist')}>
            View Wishlist
          </Button>
        )
    });
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-semibold mb-3">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft size={18} className="mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft size={18} className="mr-2" /> Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image Section */}
        <div className="bg-card rounded-lg shadow-lg overflow-hidden sticky top-24">
          <Image
            src={product.imageUrl || "https://placehold.co/600x600.png"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto object-cover aspect-square"
            data-ai-hint={`${product.category} product detail`}
            priority // Prioritize loading main product image
          />
           {product.discount && (
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-1 shadow-md">
              <Tag size={16} /> {product.discount}% OFF
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col space-y-6">
          <div>
            <Badge variant="secondary" className="capitalize mb-2">{product.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
            {/* Placeholder for seller info/link */}
            {product.sellerId && <p className="text-sm text-muted-foreground mt-1">Sold by: Seller {product.sellerId.substring(0,6)}</p>}
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Product Description</h2>
            <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          </div>
          
          <Card className="bg-card/50">
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-baseline gap-3">
                  {product.discount ? (
                    <>
                      <p className="text-3xl font-bold text-primary">${discountedPrice.toFixed(2)}</p>
                      <p className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  )}
                </div>
                <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle size={16} className="mr-1.5"/> In Stock - Ready to Ship
                </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            {user?.role !== "seller" ? (
              <Button size="lg" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAddToCart}>
                <ShoppingCart size={20} className="mr-2" /> Add to Cart
              </Button>
            ) : (
              <Button size="lg" className="flex-1" disabled>
                <ShoppingCart size={20} className="mr-2" /> Add to Cart (Disabled for Sellers)
              </Button>
            )}
            <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={handleToggleWishlist}
                disabled={user?.role === "seller"}
            >
              <Heart size={20} className={`mr-2 ${isInWishlist ? 'fill-primary' : ''}`} />
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
          
          {/* Future sections for Reviews, Q&A, etc. can be added here */}
          {/* 
          <Separator />
          <div>
            <h2 className="text-xl font-semibold mb-3">Customer Reviews</h2>
            <p className="text-muted-foreground">Reviews coming soon!</p>
          </div> 
          */}
        </div>
      </div>
       {/* Related Products Section (Placeholder) */}
      <div className="mt-16">
        <Separator className="mb-8"/>
        <h2 className="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.filter(p => p.id !== productId && p.category === product.category).slice(0, 4).map(relatedProduct => (
            <Card key={relatedProduct.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Link href={`/products/${relatedProduct.id}`}>
                <Image
                  src={relatedProduct.imageUrl || "https://placehold.co/300x300.png"}
                  alt={relatedProduct.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                  data-ai-hint={`${relatedProduct.category} related item`}
                />
                <CardContent className="p-3">
                  <CardTitle className="text-md font-semibold truncate mb-1">{relatedProduct.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground capitalize mb-1">{relatedProduct.category}</CardDescription>
                  <p className="text-md font-semibold text-primary">
                    ${relatedProduct.discount ? (relatedProduct.price * (1 - relatedProduct.discount/100)).toFixed(2) : relatedProduct.price.toFixed(2)}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
          {mockProducts.filter(p => p.id !== productId && p.category === product.category).length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">No related products in this category yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardFooter, CardTitle
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Tag, ArrowLeft, AlertCircle, CheckCircle, Heart, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/context/ProductContext"; // Import useProducts
import { useEffect, useState, useMemo } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { productId } = params;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { products: allProducts, isLoading: productsLoading, findProductById: findProductFromContext, fetchProducts } = useProducts();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  // Removed relatedProducts state, will derive from allProducts
  const [isFetchingDetails, setIsFetchingDetails] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (productId && typeof productId === 'string') {
        setIsFetchingDetails(true);
        try {
          // Try to get from context first
          let foundProduct = allProducts.find(p => p.id === productId);
          if (!foundProduct) {
            // If not in context (e.g., direct navigation), fetch individually
            foundProduct = await findProductFromContext(productId);
          }
          setProduct(foundProduct);

          if (!allProducts.length && foundProduct) { // If context was empty, fetch all for related items
            await fetchProducts(); // Ensure related products can be found
          }

        } catch (error) {
          console.error("Failed to fetch product data:", error);
          setProduct(undefined);
          toast({
            title: "Error",
            description: "Could not load product details.",
            variant: "destructive",
          });
        } finally {
          setIsFetchingDetails(false);
        }
      } else {
        setIsFetchingDetails(false);
        setProduct(undefined);
      }
    };

    // if products are already loaded in context, try finding it directly
    if (allProducts.length > 0) {
        const p = allProducts.find(p => p.id === productId);
        if (p) {
            setProduct(p);
            setIsFetchingDetails(false);
        } else {
             fetchProductData(); // Not found in current context, fetch
        }
    } else {
        fetchProductData(); // Context not loaded yet, fetch
    }
  }, [productId, allProducts, findProductFromContext, toast, fetchProducts]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product, allProducts]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };
  
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
    setIsInWishlist(!isInWishlist);
    toast({
        title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
        description: product?.name + (isInWishlist ? " removed from your wishlist." : " added to your wishlist."),
        // Example action for a wishlist page (not yet implemented)
        // action: ( 
        //   <Button variant="outline" size="sm" onClick={() => router.push('/wishlist')}>
        //     View Wishlist
        //   </Button>
        // )
    });
  };

  const isLoading = productsLoading || isFetchingDetails;

  if (isLoading && !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
        <div className="bg-card rounded-lg shadow-lg overflow-hidden sticky top-24">
          <Image
            src={product.imageUrl || "https://placehold.co/600x600.png"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto object-cover aspect-square"
            data-ai-hint={`${product.category} product detail`}
            priority
          />
           {product.discount && (
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-1 shadow-md">
              <Tag size={16} /> {product.discount}% OFF
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <Badge variant="secondary" className="capitalize mb-2">{product.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
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
        </div>
      </div>

      <div className="mt-16">
        <Separator className="mb-8"/>
        <h2 className="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>
        {productsLoading && relatedProducts.length === 0 ? ( // Show loader if context is loading and no related products yet
          <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProd => ( // Renamed variable to avoid conflict
              <Card key={relatedProd.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Link href={`/products/${relatedProd.id}`}>
                  <Image
                    src={relatedProd.imageUrl || "https://placehold.co/300x300.png"}
                    alt={relatedProd.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                    data-ai-hint={`${relatedProd.category} related item`}
                  />
                  <CardContent className="p-3">
                    <h3 className="text-md font-semibold truncate mb-1">{relatedProd.name}</h3> {/* Changed to h3 for semantic card title */}
                    <p className="text-xs text-muted-foreground capitalize mb-1">{relatedProd.category}</p> {/* Changed to p for description */}
                    <p className="text-md font-semibold text-primary">
                      ${relatedProd.discount ? (relatedProd.price * (1 - relatedProd.discount/100)).toFixed(2) : relatedProd.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No related products in this category yet.</p>
        )}
      </div>
    </div>
  );
}


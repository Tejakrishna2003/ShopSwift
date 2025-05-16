"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-full py-12 md:py-24 lg:py-32 text-center">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
            Welcome to ShopSwift
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
            Discover amazing products or start selling your own. Your one-stop shop for everything you need.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag size={20} /> Explore Products <ArrowRight size={18} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth?tab=signup" className="flex items-center gap-2">
                <Store size={20} /> Become a Seller
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Why Choose ShopSwift?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-2">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Wide Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse a vast collection of products from various categories. Find exactly what you're looking for.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-2">
                 <Store className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Sell with Ease</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Effortlessly list your products and reach a large audience of potential buyers.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="p-3 bg-accent/10 rounded-md inline-block mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Shop and sell with confidence. We prioritize your security and satisfaction.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 text-center">
        <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Featured Products</h2>
            <p className="text-foreground/80 md:text-lg mb-8">Check out some of our top picks!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for featured products */}
                {[1,2,3].map(i => (
                    <Card key={i} className="overflow-hidden shadow-lg">
                        <Image src={`https://placehold.co/600x400.png`} alt={`Featured Product ${i}`} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint="fashion product" />
                        <CardContent className="p-4">
                            <CardTitle className="text-lg mb-1">Product Name {i}</CardTitle>
                            <CardDescription className="text-sm mb-2">Category</CardDescription>
                            <p className="text-primary font-semibold text-xl">$99.99</p>
                             <Button className="mt-4 w-full" variant="outline" asChild>
                                <Link href="/products">View Product</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
             <Button size="lg" variant="default" asChild className="mt-12">
              <Link href="/products" className="flex items-center gap-2">
                Shop All Products <ArrowRight size={18} />
              </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}

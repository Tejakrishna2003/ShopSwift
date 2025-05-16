"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { cartItems, removeFromCart, cartTotal, itemCount } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    // Placeholder for checkout logic
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Checkout Initiated",
      description: "This is a demo. No real transaction will occur.",
    });
    // Potentially clear cart or redirect to a success page in a real app
  };

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-3">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => {
                  const price = item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;
                  return (
                    <TableRow key={item.product.id}>
                      <TableCell className="hidden md:table-cell">
                        <Image
                          src={item.product.imageUrl || "https://placehold.co/100x100.png"}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint={`${item.product.category} item`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>${price.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${(price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label={`Remove ${item.product.name} from cart`}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card className="shadow-lg sticky top-24"> {/* Sticky summary card */}
          <CardHeader>
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            {/* Add discount codes or other summary items here if needed */}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCheckout}>
              <CreditCard size={18} className="mr-2" />
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

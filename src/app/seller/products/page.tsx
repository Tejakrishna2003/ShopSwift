"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { mockProducts as initialProducts } from "@/lib/mockData";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AddEditProductForm from "@/components/AddEditProductForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Package, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SellerProductsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For form submissions

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    } else if (user && user.role !== "seller") {
      router.push("/"); // Redirect non-sellers
    } else if (user) {
      // Simulate fetching seller's products
      setSellerProducts(initialProducts.filter(p => p.sellerId === user.id || !p.sellerId)); // Show products with matching sellerId or generic ones for demo
    }
  }, [user, authLoading, router]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setSellerProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({ title: "Product Deleted", description: "The product has been successfully deleted." });
      setIsLoading(false);
    }, 500);
  };

  const handleFormSubmit = (productData: Omit<Product, "id" | "sellerId" | "imageUrl"> & { id?: string }) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingProduct && productData.id) { // Editing existing product
        setSellerProducts((prev) =>
          prev.map((p) => (p.id === productData.id ? { ...p, ...productData, sellerId: user!.id, imageUrl: p.imageUrl || "https://placehold.co/600x400.png" } : p))
        );
        toast({ title: "Product Updated", description: "The product has been successfully updated." });
      } else { // Adding new product
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(), // Generate mock ID
          sellerId: user!.id, // Assign current seller's ID
          imageUrl: "https://placehold.co/600x400.png", // Default image
        };
        setSellerProducts((prev) => [newProduct, ...prev]);
        toast({ title: "Product Added", description: "The new product has been successfully added." });
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      setIsLoading(false);
    }, 1000);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }
  
  if (!user || user.role !== 'seller') {
     return <div className="text-center py-10"><p>You must be logged in as a seller to view this page.</p></div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" /> My Products
        </h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProduct} className="flex items-center gap-2">
              <PlusCircle size={18} /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update the details of your product." : "Fill in the details to add a new product."}
              </DialogDescription>
            </DialogHeader>
            <AddEditProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {sellerProducts.length > 0 ? (
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden lg:table-cell">Discount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      src={product.imageUrl || "https://placehold.co/100x100.png"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                      data-ai-hint={`${product.category} product`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell capitalize">{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{product.discount ? `${product.discount}%` : "-"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="text-primary hover:text-primary/80" aria-label="Edit Product">
                      <Edit size={18} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label="Delete Product">
                          <Trash2 size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product "{product.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any products. Click "Add New Product" to get started.
          </p>
           <Button onClick={handleAddProduct} className="flex items-center gap-2 mx-auto">
              <PlusCircle size={18} /> Add New Product
            </Button>
        </div>
      )}
    </div>
  );
}

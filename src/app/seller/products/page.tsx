
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext"; // Import useProducts
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from "@/components/ui/alert-dialog";
import AddEditProductForm from "@/components/AddEditProductForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Package, Search, Loader2 } from "lucide-react";
// useToast is now handled by ProductContext for product actions

export default function SellerProductsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    products: allProducts, 
    isLoading: productsLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    fetchProducts // In case a manual refresh is needed
  } = useProducts();
  const router = useRouter();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    } else if (user && user.role !== "seller") {
      router.push("/"); 
    }
    // Products are fetched by ProductContext provider
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const sellerProducts = useMemo(() => {
    if (!user) return [];
    // For mock, filter by sellerId. In a real app, API would return only seller's products.
    // Or, if products don't have sellerId (e.g. older mock data), show them for demo purposes if logged in as any seller.
    return allProducts.filter(p => p.sellerId === user.id || (!p.sellerId && user.role === 'seller'));
  }, [allProducts, user]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!user) return;
    setIsSubmittingForm(true);
    await deleteProduct(productId, user.id);
    setIsSubmittingForm(false);
  };

  const handleFormSubmit = async (productData: Omit<Product, "id" | "sellerId" | "imageUrl"> & { id?: string }) => {
    if (!user) return;
    setIsSubmittingForm(true);
    if (editingProduct && productData.id) { // Editing existing product
      await updateProduct(productData.id, productData, user.id);
    } else { // Adding new product
      await addProduct(productData, user.id);
    }
    setIsSubmittingForm(false);
    setIsFormOpen(false);
    setEditingProduct(null);
  };
  
  // Combined loading state
  const isLoading = authLoading || productsLoading;

  if (isLoading && !sellerProducts.length) { // Show main loader if no products are displayed yet
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
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingProduct(null);
        }}>
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
              isLoading={isSubmittingForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      {productsLoading && sellerProducts.length === 0 && ( // More subtle loader if products might be loading in background
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      )}

      {!productsLoading && sellerProducts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any products. Click "Add New Product" to get started.
          </p>
           <Button onClick={handleAddProduct} className="flex items-center gap-2 mx-auto" disabled={isSubmittingForm}>
              <PlusCircle size={18} /> Add New Product
            </Button>
        </div>
      ) : sellerProducts.length > 0 ? (
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
                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="text-primary hover:text-primary/80" aria-label="Edit Product" disabled={isSubmittingForm}>
                      <Edit size={18} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label="Delete Product" disabled={isSubmittingForm}>
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
                          <AlertDialogCancel disabled={isSubmittingForm}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} disabled={isSubmittingForm} className="bg-destructive hover:bg-destructive/90">
                            {isSubmittingForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
      ) : null}
    </div>
  );
}

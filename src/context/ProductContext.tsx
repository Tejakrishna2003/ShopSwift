
"use client";

import type { Product } from "@/lib/types";
import {
  getMockProductsAsync,
  addMockProductAsync as apiAddMockProduct,
  updateMockProductAsync as apiUpdateMockProduct,
  deleteMockProductAsync as apiDeleteMockProduct,
  findMockProductByIdAsync as apiFindMockProductById
} from "@/lib/mockData";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (productData: Omit<Product, "id" | "sellerId" | "imageUrl">, sellerId: string) => Promise<Product | null>;
  updateProduct: (productId: string, productData: Partial<Omit<Product, "id" | "sellerId" | "imageUrl">>, sellerId: string) => Promise<Product | null>;
  deleteProduct: (productId: string, sellerId: string) => Promise<boolean>;
  findProductById: (productId: string) => Promise<Product | undefined>;
  fetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth(); // To get sellerId easily

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getMockProductsAsync();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({ title: "Error", description: "Could not load products.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: Omit<Product, "id" | "sellerId" | "imageUrl">, sellerId: string): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const newProduct = await apiAddMockProduct(productData, sellerId);
      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      toast({ title: "Product Added", description: `${newProduct.name} has been successfully added.` });
      setIsLoading(false);
      return newProduct;
    } catch (error) {
      console.error("Failed to add product:", error);
      toast({ title: "Error", description: "Could not add product.", variant: "destructive" });
      setIsLoading(false);
      return null;
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Omit<Product, "id" | "sellerId" | "imageUrl">>, sellerId: string): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const updatedProduct = await apiUpdateMockProduct(productId, productData, sellerId);
      if (updatedProduct) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        toast({ title: "Product Updated", description: `${updatedProduct.name} has been successfully updated.` });
        setIsLoading(false);
        return updatedProduct;
      } else {
        toast({ title: "Error", description: "Failed to update product or unauthorized.", variant: "destructive" });
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({ title: "Error", description: "Could not update product.", variant: "destructive" });
      setIsLoading(false);
      return null;
    }
  };

  const deleteProduct = async (productId: string, sellerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await apiDeleteMockProduct(productId, sellerId);
      if (success) {
        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
        toast({ title: "Product Deleted", description: "The product has been successfully deleted." });
        setIsLoading(false);
        return true;
      } else {
        toast({ title: "Error", description: "Failed to delete product or unauthorized.", variant: "destructive" });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({ title: "Error", description: "Could not delete product.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
  };
  
  const findProductById = async (productId: string): Promise<Product | undefined> => {
    // Attempt to find in current state first for speed
    const foundInState = products.find(p => p.id === productId);
    if (foundInState) {
      return Promise.resolve(foundInState);
    }
    // If not found or products array is empty, try fetching from "API"
    // This is more of a fallback for the mock setup
    setIsLoading(true);
    try {
      const product = await apiFindMockProductById(productId);
      setIsLoading(false);
      return product;
    } catch (error) {
      console.error("Failed to find product by ID:", error);
      setIsLoading(false);
      return undefined;
    }
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, addProduct, updateProduct, deleteProduct, findProductById, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

"use client";

import { useState, FormEvent, useEffect } from "react";
import type { Product } from "@/lib/types";
import { productCategories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AddEditProductFormProps {
  product?: Product | null; // Product to edit, null or undefined for new product
  onSubmit: (productData: Omit<Product, "id" | "sellerId" | "imageUrl"> & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddEditProductForm = ({ product, onSubmit, onCancel, isLoading }: AddEditProductFormProps) => {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || productCategories[1]); // Default to first actual category
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState<string>(product?.price?.toString() || "");
  const [discount, setDiscount] = useState<string>(product?.discount?.toString() || "");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setDescription(product.description);
      setPrice(product.price.toString());
      setDiscount(product.discount?.toString() || "");
    } else {
      // Reset form for new product
      setName("");
      setCategory(productCategories[1]);
      setDescription("");
      setPrice("");
      setDiscount("");
    }
  }, [product]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const productData: Omit<Product, "id" | "sellerId" | "imageUrl"> & { id?: string } = {
      name,
      category,
      description,
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : undefined,
    };
    if (product?.id) {
      productData.id = product.id;
    }
    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product-name">Product Name</Label>
        <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="product-category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="product-category">
            <SelectValue /> {/* Removed placeholder="Select category" */}
          </SelectTrigger>
          <SelectContent>
            {productCategories.filter(cat => cat !== "all").map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="product-description">Description</Label>
        <Textarea id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product-price">Price ($)</Label>
          <Input id="product-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
        </div>
        <div>
          <Label htmlFor="product-discount">Discount (%)</Label>
          <Input id="product-discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" max="100" step="1" placeholder="e.g., 10 for 10%"/>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Save Changes" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddEditProductForm;

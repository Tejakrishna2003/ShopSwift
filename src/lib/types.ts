
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount?: number;
  imageUrl?: string;
  sellerId?: string; // To associate product with a seller
}

export type UserRole = "buyer" | "seller";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

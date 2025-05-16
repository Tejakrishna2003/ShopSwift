
import type { Product } from "./types";

// Simulating a database store
let productsStore: Product[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    category: "clothes",
    description: "A comfortable and stylish classic t-shirt, perfect for everyday wear.",
    price: 25.99,
    discount: 5,
    imageUrl: "https://placehold.co/600x400.png",
    sellerId: "seller1",
  },
  {
    id: "2",
    name: "Running Shoes",
    category: "shoes",
    description: "Lightweight and durable running shoes for optimal performance.",
    price: 89.50,
    imageUrl: "https://placehold.co/600x400.png",
    sellerId: "seller2",
  },
  {
    id: "3",
    name: "Summer Dress",
    category: "clothes",
    description: "Elegant summer dress made from breathable cotton.",
    price: 45.00,
    discount: 10,
    imageUrl: "https://placehold.co/600x400.png",
    sellerId: "seller1",
  },
  {
    id: "4",
    name: "Leather Boots",
    category: "shoes",
    description: "Stylish and sturdy leather boots for all weather conditions.",
    price: 120.00,
    imageUrl: "https://placehold.co/600x400.png",
    sellerId: "seller2",
  },
  {
    id: "5",
    name: "Denim Jeans",
    category: "clothes",
    description: "Modern slim-fit denim jeans.",
    price: 60.00,
    imageUrl: "https://placehold.co/600x400.png",
    sellerId: "seller1",
  },
  {
    id: "6",
    name: "Casual Sneakers",
    category: "shoes",
    description: "Comfortable sneakers for casual outings.",
    price: 75.00,
    discount: 15,
    imageUrl: "https://placehold.co/600x400.png",
    sellerId: "seller2",
  },
];

export const productCategories = ["all", "clothes", "shoes", "electronics", "books", "home"];

// --- Asynchronous Product Operations (Simulating API calls to a PostgreSQL backend) ---

// Simulates fetching all products
export const getMockProductsAsync = async (): Promise<Product[]> => {
  // In a real app, this would be:
  // const response = await fetch('/api/products');
  // const data = await response.json();
  // return data;
  console.log("Mock API: Fetching all products");
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return Promise.resolve([...productsStore]);
};

// Simulates fetching a single product by ID
export const findMockProductByIdAsync = async (id: string): Promise<Product | undefined> => {
  // In a real app, this would be:
  // const response = await fetch(`/api/products/${id}`);
  // if (!response.ok) return undefined;
  // const data = await response.json();
  // return data;
  console.log(`Mock API: Fetching product with id ${id}`);
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  const product = productsStore.find((p) => p.id === id);
  return Promise.resolve(product ? {...product} : undefined);
};

// Simulates adding a new product
export const addMockProductAsync = async (productData: Omit<Product, "id" | "imageUrl">, sellerId: string): Promise<Product> => {
  // In a real app, this would be:
  // const response = await fetch('/api/products', { method: 'POST', body: JSON.stringify(productData), headers: {'Content-Type': 'application/json'} });
  // const newProduct = await response.json();
  // return newProduct;
  console.log("Mock API: Adding new product", productData);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString(),
    sellerId: sellerId,
    imageUrl: "https://placehold.co/600x400.png", // Default image for new products
  };
  productsStore = [newProduct, ...productsStore];
  return Promise.resolve({...newProduct});
};

// Simulates updating an existing product
export const updateMockProductAsync = async (productId: string, productData: Partial<Omit<Product, "id" | "sellerId" | "imageUrl">>, sellerId: string): Promise<Product | null> => {
  // In a real app, this would be:
  // const response = await fetch(`/api/products/${productId}`, { method: 'PUT', body: JSON.stringify(productData), headers: {'Content-Type': 'application/json'} });
  // if (!response.ok) return null;
  // const updatedProduct = await response.json();
  // return updatedProduct;
  console.log(`Mock API: Updating product with id ${productId}`, productData);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  let productIndex = productsStore.findIndex(p => p.id === productId && p.sellerId === sellerId);
  if (productIndex !== -1) {
    productsStore[productIndex] = { ...productsStore[productIndex], ...productData };
    return Promise.resolve({...productsStore[productIndex]});
  }
  return Promise.resolve(null); // Or throw an error if not found/not authorized
};

// Simulates deleting a product
export const deleteMockProductAsync = async (productId: string, sellerId: string): Promise<boolean> => {
  // In a real app, this would be:
  // const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
  // return response.ok;
  console.log(`Mock API: Deleting product with id ${productId}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const initialLength = productsStore.length;
  productsStore = productsStore.filter(p => !(p.id === productId && p.sellerId === sellerId));
  return Promise.resolve(productsStore.length < initialLength);
};

// Legacy synchronous data for components not yet refactored (if any)
// It's better to refactor all usages, but this can be a temporary bridge.
export const mockProducts: Product[] = productsStore;

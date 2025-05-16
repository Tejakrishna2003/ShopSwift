import type { Product } from "./types";

export const mockProducts: Product[] = [
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


"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ProductProvider } from "./ProductContext"; // Import ProductProvider

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <ProductProvider> {/* Wrap CartProvider (and children) with ProductProvider */}
        <CartProvider>
          {children}
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default AppProviders;

import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import { CartProvider } from "@/context/CartContext";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <NavBar />
      {children}
      <footer className="mt-16 border-t border-neutral-200 px-6 py-8 text-center text-sm text-neutral-500 lg:px-12">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </footer>
    </CartProvider>
  );
}
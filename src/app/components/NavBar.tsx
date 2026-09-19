"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function NavBar() {
  const { count } = useCart();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<"customer" | "admin" | null>(null);

  useEffect(() => {
    function readAuth() {
      try {
        const saved = localStorage.getItem("auth");
        const parsed = saved ? JSON.parse(saved) : null;
        setUsername(parsed ? parsed.username : null);
        setRole(parsed ? parsed.role || "customer" : null);
      } catch {
        setUsername(null);
        setRole(null);
      }
    }

    readAuth();
    window.addEventListener("auth-change", readAuth);
    window.addEventListener("storage", readAuth);
    return () => {
      window.removeEventListener("auth-change", readAuth);
      window.removeEventListener("storage", readAuth);
    };
  }, []);

  function logout() {
    localStorage.removeItem("auth");
    setUsername(null);
    setRole(null);
    window.dispatchEvent(new Event("auth-change"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <nav className="flex w-full items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/store/home" className="text-xl font-bold text-neutral-900">
          MyStore
        </Link>

        <div className="flex items-center gap-6 font-semibold text-neutral-700">
          <Link href="/store/home" className="hover:text-blue-600">Home</Link>
          <Link href="/store/shop" className="hover:text-blue-600">Shop</Link>
          <Link href="/store/cart" className="hover:text-blue-600">
            Cart
            <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
              {count}
            </span>
          </Link>

          <Link href="/store/orders" className="hover:text-blue-600">
            Orders
          </Link>

          {username ? (
            <button onClick={logout} className="hover:text-blue-600">
              Logout
            </button>
          ) : (
            <Link href="/store/authentication/login" className="hover:text-blue-600">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
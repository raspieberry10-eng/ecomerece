"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  product: { id: number; title: string; price: number; image: string };
};

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-8 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white hover:bg-blue-500"
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
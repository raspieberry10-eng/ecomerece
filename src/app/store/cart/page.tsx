"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, total, setQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <main className="w-full px-6 pt-6 text-neutral-900 lg:px-12">
        <h1 className="mb-6 text-3xl font-bold">Your cart</h1>
        <div className="rounded-2xl border border-neutral-200 p-8 text-center">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <Link
            href="/store/shop"
            className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-6 pt-6 text-neutral-900 lg:px-12">
      <h1 className="mb-6 text-3xl font-bold">Your cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-2xl border border-neutral-200 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="h-24 w-24 object-contain" />

              <div className="flex-1">
                <Link href={`/store/products/${item.id}`} className="font-medium hover:text-blue-600">
                  {item.title}
                </Link>
                <p className="text-neutral-500">${item.price.toFixed(2)}</p>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => setQty(item.id, item.qty - 1)}
                    className="h-8 w-8 rounded-lg border border-neutral-300"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.id, item.qty + 1)}
                    className="h-8 w-8 rounded-lg border border-neutral-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-sm font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          <Link
            href="/store/checkout"
            className="mt-6 block w-full rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-500"
          >
            Checkout
          </Link>
          <button
            onClick={clear}
            className="mt-3 w-full text-sm font-semibold text-neutral-500 hover:underline"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </main>
  );
}
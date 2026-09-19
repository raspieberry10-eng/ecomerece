"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    id: number;
    title: string;
    price: number;
    image: string;
    qty: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const shipping = useMemo(() => (items.length > 0 ? 12 : 0), [items.length]);
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <main className="w-full px-6 pt-6 text-neutral-900 lg:px-12">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        <div className="rounded-2xl border border-neutral-200 p-8 text-center">
          <p className="text-lg font-semibold">Your cart is empty.</p>
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

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    if (!trimmed.name || !trimmed.email || !trimmed.phone || !trimmed.address) {
      window.alert("Please fill in all checkout fields.");
      return;
    }

    setSubmitting(true);

    const order: Order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      total: grandTotal,
      items,
      customer: trimmed,
    };

    try {
      const saved = JSON.parse(localStorage.getItem("orders") || "[]");
      const nextOrders = Array.isArray(saved) ? saved : [];
      localStorage.setItem("orders", JSON.stringify([order, ...nextOrders]));
      clear();
      router.push("/store/orders");
    } catch {
      window.alert("Order could not be saved. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="w-full px-6 pb-16 pt-6 text-neutral-900 lg:px-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Link href="/store/cart" className="font-semibold text-blue-600 hover:underline">
          Back to cart
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-neutral-200 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Full name</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none ring-0 transition focus:border-blue-600"
              placeholder="John Smith"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-blue-600"
                placeholder="john@email.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-blue-600"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="min-h-28 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-blue-600"
              placeholder="123 Main Street, City, Country"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {item.title} <span className="text-neutral-500">× {item.qty}</span>
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

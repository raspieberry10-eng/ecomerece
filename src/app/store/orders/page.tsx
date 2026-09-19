"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        setOrders([]);
      }
    }
  }, []);

  return (
    <main className="w-full px-6 pb-16 pt-6 text-neutral-900 lg:px-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My orders</h1>
        <Link href="/store/shop" className="font-semibold text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 p-8 text-center">
          <p className="text-lg font-semibold">No orders yet.</p>
          <p className="mt-2 text-neutral-600">Your placed orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-neutral-200 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Order #{order.id}</p>
                  <p className="text-lg font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {order.status}
                  </span>
                  <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p><span className="font-semibold text-neutral-900">Customer:</span> {order.customer.name}</p>
                <p><span className="font-semibold text-neutral-900">Address:</span> {order.customer.address}</p>
                <p><span className="font-semibold text-neutral-900">Items:</span> {order.items.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

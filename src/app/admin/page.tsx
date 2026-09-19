"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthUser = {
  username: string;
  token: string;
  role: "customer" | "admin";
};

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
};

const PRODUCT_STORAGE_KEY = "admin-products";

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

const seedProducts: Product[] = [
  { id: 1, title: "Classic Tee", category: "Men's clothing", price: 29.99, stock: 25 },
  { id: 2, title: "Leather Wallet", category: "Jewelery", price: 49.5, stock: 14 },
  { id: 3, title: "Noise Cancelling Headphones", category: "Electronics", price: 199.99, stock: 9 },
  { id: 4, title: "Tailored Blazer", category: "Women's clothing", price: 119.0, stock: 8 },
];

function getStoredProducts(): Product[] {
  const raw = localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!raw) return seedProducts;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedProducts;
  } catch {
    return seedProducts;
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Men's clothing", price: "", stock: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth");
      const parsed = raw ? JSON.parse(raw) : null;

      if (!parsed || parsed.role !== "admin") {
        router.replace("/store/authentication/login");
        return;
      }

      setUser(parsed);

      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedProducts = getStoredProducts();
      setProducts(savedProducts);
    } catch {
      router.replace("/store/authentication/login");
    } finally {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return <main className="px-6 py-12 text-center text-neutral-600">Loading dashboard...</main>;
  }

  if (!user) {
    return (
      <main className="px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Access denied</h1>
        <p className="mt-3 text-neutral-600">You need an admin account to view this panel.</p>
        <Link href="/store/authentication/login" className="mt-5 inline-block font-semibold text-blue-600 hover:underline">
          Go to login
        </Link>
      </main>
    );
  }

  function updateOrderStatus(orderId: string, nextStatus: string) {
    const newOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: nextStatus } : order
    );

    setOrders(newOrders);
    localStorage.setItem("orders", JSON.stringify(newOrders));
  }

  function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!title || Number.isNaN(price) || Number.isNaN(stock) || price <= 0 || stock < 0) {
      window.alert("Please enter valid product details.");
      return;
    }

    const nextProduct: Product = {
      id: Date.now(),
      title,
      category: form.category,
      price,
      stock,
    };

    const nextProducts = [nextProduct, ...products];
    setProducts(nextProducts);
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(nextProducts));
    setForm({ title: "", category: "Men's clothing", price: "", stock: "" });
  }

  function handleLogout() {
    localStorage.removeItem("auth");
    router.replace("/store/authentication/login");
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const statusClasses: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    Paid: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    Shipped: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
    Delivered: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  };

  const stats = [
    {
      label: "Total revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      detail: "Across all orders",
      accent: "bg-blue-50 text-blue-600",
      icon: "↗",
    },
    {
      label: "Orders",
      value: String(orders.length),
      detail: "Live checkouts",
      accent: "bg-violet-50 text-violet-600",
      icon: "◌",
    },
    {
      label: "Products",
      value: String(products.length),
      detail: "In store catalog",
      accent: "bg-emerald-50 text-emerald-600",
      icon: "▣",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 px-6 pb-16 pt-8 text-neutral-900 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Admin</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">Dashboard</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Logged in as {user.username}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
              <div className="mb-4 flex items-center justify-between">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-semibold ${stat.accent}`}>
                  {stat.icon}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">Live</span>
              </div>
              <p className="text-sm text-neutral-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-neutral-950">{stat.value}</p>
              <p className="mt-2 text-xs text-neutral-500">{stat.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950">Recent orders</h2>
                <p className="text-sm text-neutral-500">Latest purchases from your store</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                Real orders
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-neutral-600">No orders yet.</div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-neutral-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Order</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-neutral-200 bg-white">
                        <td className="px-4 py-3 font-semibold text-neutral-800">{order.id}</td>
                        <td className="px-4 py-3 text-neutral-700">{order.customer.name}</td>
                        <td className="px-4 py-3 font-medium text-neutral-800">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`rounded-full px-2.5 py-1.5 text-xs font-semibold outline-none ${statusClasses[order.status] || "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200"}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-950">Inventory</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{products.length} items</span>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-3">
                  <div>
                    <p className="font-medium text-neutral-900">{product.title}</p>
                    <p className="text-xs text-neutral-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-neutral-500">{product.stock} in stock</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddProduct} className="mt-6 space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Add product</h3>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Product title"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Men's clothing">Men's clothing</option>
                <option value="Women's clothing">Women's clothing</option>
                <option value="Jewelery">Jewelery</option>
                <option value="Electronics">Electronics</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                  placeholder="Stock"
                  min="0"
                  step="1"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
              >
                Add product
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

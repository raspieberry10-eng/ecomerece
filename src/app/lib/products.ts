export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

const PRODUCTS_URL = "https://fakestoreapi.com/products";

export const fallbackProducts: Product[] = [
  {
    id: 1,
    title: "Fjallraven Backpack",
    price: 109.95,
    description: "A durable everyday backpack with room for your essentials and laptop.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "A comfortable premium slim-fit t-shirt for everyday wear.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description: "A versatile cotton jacket that adds an easy layer to any outfit.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
  },
  {
    id: 4,
    title: "WD 2TB Portable External Hard Drive",
    price: 64,
    description: "Portable external storage for backups, media, and everyday files.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
  },
];

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(PRODUCTS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return fallbackProducts;

    const products = await res.json();
    return Array.isArray(products) && products.length > 0 ? products : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${PRODUCTS_URL}/${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const product = await res.json();
      if (product && typeof product === "object") return product;
    }
  } catch {
    // Use the local catalog when the external API is unavailable.
  }

  return fallbackProducts.find((product) => String(product.id) === id) ?? null;
}
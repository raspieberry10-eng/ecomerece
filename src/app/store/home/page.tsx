import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
};

const categories = [
  { name: "Men's clothing", value: "men's clothing" },
  { name: "Women's clothing", value: "women's clothing" },
  { name: "Jewelery", value: "jewelery" },
  { name: "Electronics", value: "electronics" },
];

// Free online API with real product pictures.
// Later, replace this URL with your own Express API, e.g. http://localhost:5000/api/products
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/store/products/${product.id}`}
      className="group rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
    >
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-neutral-200 bg-white p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 line-clamp-2 font-medium group-hover:text-blue-600">
        {product.title}
      </h3>
      <p className="text-neutral-500">${product.price.toFixed(2)}</p>
    </Link>
  );
}

function SectionHead({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-baseline justify-between">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {href && (
        <Link href={href} className="font-semibold text-blue-600 hover:underline">
          View all
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 4);
  const newArrivals = products.slice(-4).reverse();

  return (
    <main className="w-full px-6 pb-16 pt-6 text-neutral-900 lg:px-12">
      {/* Hero banner */}
      <section className="rounded-3xl bg-neutral-900 px-6 py-12 text-white sm:px-12 sm:py-20">
        <div className="max-w-xl">
          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
            Everyday essentials, delivered to your door.
          </h1>
          <p className="text-lg text-neutral-300">
            Shop clothing, jewelery and electronics at fair prices.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-14">
        <SectionHead title="Shop by category" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.value}
              href={`/store/shop?category=${encodeURIComponent(c.value)}`}
              className="rounded-2xl border border-neutral-200 px-4 py-8 text-center font-semibold hover:border-blue-600 hover:text-blue-600"
            >
              {c.name}
            </Link>
          ))}
        </div>


      </section>

      {products.length === 0 ? (
        <p className="mt-14 rounded-2xl border border-neutral-200 p-6 text-neutral-600">
          Products could not be loaded. Check your internet connection and
          refresh the page.
        </p>
      ) : (
        <>
          {/* Featured products */}
          <section className="mt-14">
            <SectionHead title="Featured products" href="/store/shop" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          {/* New arrivals */}
          <section className="mt-14">
            <SectionHead title="New arrivals" href="/store/shop?sort=newest" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
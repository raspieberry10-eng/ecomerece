import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 8;

const categories = [
  { name: "Men's clothing", value: "men's clothing" },
  { name: "Women's clothing", value: "women's clothing" },
  { name: "Jewelery", value: "jewelery" },
  { name: "Electronics", value: "electronics" },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Name: A to Z", value: "name" },
];

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

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
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

const fieldClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const category = first(sp.category);
  const min = first(sp.min);
  const max = first(sp.max);
  const sort = first(sp.sort) || "featured";
  const requestedPage = Math.max(1, parseInt(first(sp.page), 10) || 1);

  const all = await getProducts();

  // Filtering
  const minNum = min !== "" && !Number.isNaN(Number(min)) ? Number(min) : null;
  const maxNum = max !== "" && !Number.isNaN(Number(max)) ? Number(max) : null;
  const term = q.toLowerCase();

  let list = all.filter((p) => {
    if (term && !p.title.toLowerCase().includes(term)) return false;
    if (category && p.category !== category) return false;
    if (minNum !== null && p.price < minNum) return false;
    if (maxNum !== null && p.price > maxNum) return false;
    return true;
  });

  // Sorting
  list = [...list];
  if (sort === "newest") list.sort((a, b) => b.id - a.id);
  else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
  else list.sort((a, b) => a.id - b.id);

  // Pagination
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const visible = list.slice(start, start + PAGE_SIZE);

  function pageHref(n: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    if (sort !== "featured") params.set("sort", sort);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/store/shop?${qs}` : "/store/shop";
  }

  const hasFilters = Boolean(q || category || min || max);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="w-full px-6 pb-16 pt-6 text-neutral-900 lg:px-12">
      <h1 className="mb-6 text-3xl font-bold">Shop</h1>

      {/* Search, filters and sorting (plain GET form, no JavaScript needed) */}
      <form
        action="/store/shop"
        method="get"
        className="grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 p-4 md:grid-cols-6"
      >
        <label className="col-span-2 md:col-span-6 lg:col-span-2">
          <span className="mb-1 block text-sm font-medium">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products"
            className={fieldClass}
          />
        </label>

        <label className="col-span-2 md:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-sm font-medium">Category</span>
          <select name="category" defaultValue={category} className={fieldClass}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Min price</span>
          <input
            type="number"
            name="min"
            min="0"
            step="1"
            defaultValue={min}
            placeholder="0"
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Max price</span>
          <input
            type="number"
            name="max"
            min="0"
            step="1"
            defaultValue={max}
            placeholder="1000"
            className={fieldClass}
          />
        </label>

        <label className="col-span-2 md:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-sm font-medium">Sort by</span>
          <select name="sort" defaultValue={sort} className={fieldClass}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="col-span-2 flex items-end gap-3 md:col-span-6 lg:col-span-1">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Apply
          </button>
          {hasFilters && (
            <Link
              href="/store/shop"
              className="whitespace-nowrap text-sm font-semibold text-blue-600 hover:underline"
            >
              Clear all
            </Link>
          )}
        </div>
      </form>

      {/* Results */}
      {all.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-neutral-200 p-6 text-neutral-600">
          Products could not be loaded. Check your internet connection and
          refresh the page.
        </p>
      ) : total === 0 ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 p-8 text-center">
          <p className="text-lg font-semibold">No products match your filters</p>
          <p className="mt-1 text-neutral-600">
            Try a different search or widen the price range.
          </p>
          <Link
            href="/store/shop"
            className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
          >
            Clear all filters
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-5 mt-6 text-sm text-neutral-600">
            Showing {start + 1} to {start + visible.length} of {total}{" "}
            {total === 1 ? "product" : "products"}
          </p>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-blue-600 hover:text-blue-600"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-400">
                  Previous
                </span>
              )}

              {pageNumbers.map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={
                    n === page
                      ? "rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-blue-600 hover:text-blue-600"
                  }
                >
                  {n}
                </Link>
              ))}

              {page < totalPages ? (
                <Link
                  href={pageHref(page + 1)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-blue-600 hover:text-blue-600"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-400">
                  Next
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </main>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, type Product } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="w-full px-6 pb-16 pt-6 text-neutral-900 lg:px-12">
      <Link href="/store/shop" className="text-sm font-semibold text-blue-600 hover:underline">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-neutral-200 bg-white p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
        </div>

        <div>
          <p className="text-sm capitalize text-neutral-500">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
          <p className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-neutral-600">{product.description}</p>

          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
            }}
          />
        </div>
      </div>
    </main>
  );
}
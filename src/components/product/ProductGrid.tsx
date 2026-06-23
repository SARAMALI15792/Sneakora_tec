import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | { toString(): string };
  compareAt: number | { toString(): string } | null;
  images: string[];
  category: string;
  colors: string[];
  stock: number;
  featured: boolean;
};

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          No Results
        </p>
        <h3 className="font-heading mt-3 text-2xl font-bold">No products found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update product details
        </p>
      </div>
      <ProductForm
        product={{
          ...product,
          price: Number(product.price),
          compareAt: product.compareAt ? Number(product.compareAt) : null,
        }}
      />
    </div>
  );
}

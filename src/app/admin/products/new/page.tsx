import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new product in your catalog
        </p>
      </div>
      <ProductForm />
    </div>
  );
}

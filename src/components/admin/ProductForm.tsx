"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const categories = [
  "men",
  "women",
  "kids",
  "sports",
  "casual",
];

export function ProductForm({
  product,
}: {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compareAt: number | null;
    category: string;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    featured: boolean;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState(product?.name ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [description, setDescription] = React.useState(
    product?.description ?? ""
  );
  const [price, setPrice] = React.useState(String(product?.price ?? ""));
  const [compareAt, setCompareAt] = React.useState(
    String(product?.compareAt ?? "")
  );
  const [category, setCategory] = React.useState(product?.category ?? "");
  const [stock, setStock] = React.useState(String(product?.stock ?? "0"));
  const [images, setImages] = React.useState<string[]>(product?.images ?? []);
  const [imageInput, setImageInput] = React.useState("");
  const [sizes, setSizes] = React.useState<string[]>(product?.sizes ?? []);
  const [sizeInput, setSizeInput] = React.useState("");
  const [colors, setColors] = React.useState<string[]>(product?.colors ?? []);
  const [colorInput, setColorInput] = React.useState("");
  const [featured, setFeatured] = React.useState(product?.featured ?? false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const isEditing = !!product;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!slug.trim()) errs.slug = "Slug is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      errs.price = "Valid price is required";
    if (!category) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addTag = (
    list: string[],
    setList: (v: string[]) => void,
    input: string,
    setInput: (v: string) => void
  ) => {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setInput("");
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const body = {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        description: description.trim() || undefined,
        price: Number(price),
        compareAt: compareAt ? Number(compareAt) : undefined,
        category,
        images,
        sizes,
        colors,
        stock: Number(stock),
        featured,
      };

      const res = isEditing
        ? await fetch(`/api/admin/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to save product");
        return;
      }

      toast.success(
        isEditing ? "Product updated" : "Product created"
      );
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Product" : "New Product"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEditing && !slug)
                    setSlug(generateSlug(e.target.value));
                }}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                aria-invalid={!!errors.slug}
              />
              {errors.slug && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.slug}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.price}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="compareAt">Compare At ($)</Label>
              <Input
                id="compareAt"
                type="number"
                step="0.01"
                value={compareAt}
                onChange={(e) => setCompareAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger aria-invalid={!!errors.category}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.category}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="size-4 rounded border-border accent-accent"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured product
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images (URLs)</Label>
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(images, setImages, imageInput, setImageInput);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addTag(images, setImages, imageInput, setImageInput)
                }
              >
                Add
              </Button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                  >
                    {img.length > 40 ? img.slice(0, 40) + "..." : img}
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, j) => j !== i))
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Sizes</Label>
              <div className="flex gap-2">
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g. US 9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(sizes, setSizes, sizeInput, setSizeInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addTag(sizes, setSizes, sizeInput, setSizeInput)
                  }
                >
                  Add
                </Button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizes.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() =>
                          setSizes(sizes.filter((_, j) => j !== i))
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="flex gap-2">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="e.g. Black"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(colors, setColors, colorInput, setColorInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addTag(colors, setColors, colorInput, setColorInput)
                  }
                >
                  Add
                </Button>
              </div>
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() =>
                          setColors(colors.filter((_, j) => j !== i))
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

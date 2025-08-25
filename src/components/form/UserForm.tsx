"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Modal } from "@/components/form/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCategory, ProductOrigin, ProductStatus } from "@/types/enum";
import type { Product, User, CreateProductDto, UpdateProductDto } from "@/types";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => void;
  suppliers?: User[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit,
  suppliers,
}) => {
  const [form, setForm] = useState<CreateProductDto | UpdateProductDto>({
    slug: "",
    name: "",
    description: undefined,
    price: 0,
    stock: 0,
    category: ProductCategory.COFFEE,
    status: ProductStatus.ACTIVE,
    origin: ProductOrigin.INDONESIA,
  });

  useEffect(() => {
    if (product) {
      setForm({
        slug: product.slug,
        name: product.name,
        description: product.description ?? undefined,
        price: product.price,
        stock: product.stock,
        category: product.category,
        status: product.status,
        origin: product.origin,
      });
    }
  }, [product]);

  const handleChange = (field: keyof CreateProductDto | keyof UpdateProductDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Product" : "Create Product"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </div>

        <div>
          <label>Slug</label>
          <Input value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} required />
        </div>

        <div>
          <label>Description</label>
          <Input
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label>Price</label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <label>Stock</label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", parseInt(e.target.value))}
          />
        </div>

        <div>
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value as ProductCategory)}
          >
            {Object.values(ProductCategory).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value as ProductStatus)}
          >
            {Object.values(ProductStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Origin</label>
          <select
            value={form.origin}
            onChange={(e) => handleChange("origin", e.target.value as ProductOrigin)}
          >
            {Object.values(ProductOrigin).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{product ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
};

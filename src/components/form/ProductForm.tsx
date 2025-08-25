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
    } else {
      // Reset form when creating new product
      setForm({
        slug: "",
        name: "",
        description: undefined,
        price: 0,
        stock: 0,
        category: ProductCategory.COFFEE,
        status: ProductStatus.ACTIVE,
        origin: ProductOrigin.INDONESIA,
      });
    }
  }, [product, isOpen]);

  const handleChange = (field: keyof CreateProductDto | keyof UpdateProductDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Product" : "Create Product"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input 
            value={form.name} 
            onChange={(e) => handleChange("name", e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <Input 
            value={form.slug} 
            onChange={(e) => handleChange("slug", e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <Input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium mb-1">Origin</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
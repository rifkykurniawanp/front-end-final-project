import React, { useState } from "react";
import { ProductResponseDto, UpdateProductDto } from "@/types/product";
import { ProductStatus, ProductCategory, ProductOrigin } from "@/types";

interface ProductsTableProps {
  products: ProductResponseDto[];
  onEdit: (data: UpdateProductDto) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onEdit }) => {
  const [selectedProduct, setSelectedProduct] = useState<UpdateProductDto | null>(null);

  const handleEdit = (product: ProductResponseDto) => {
    const formData: UpdateProductDto = {
      name: product.name,
      slug: product.slug,
      description: product.description ?? undefined,
      price: product.price,
      stock: product.stock,
      category: product.category as ProductCategory,
      status: product.status as ProductStatus,
      origin: product.origin as ProductOrigin,
      weight: product.weight ?? undefined,
      tags: product.tags,
    };
    setSelectedProduct(formData);
    onEdit(formData);
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Status</th>
          <th>Origin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.stock}</td>
            <td>{product.category}</td>
            <td>{product.status}</td>
            <td>{product.origin}</td>
            <td>
              <button onClick={() => handleEdit(product)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;

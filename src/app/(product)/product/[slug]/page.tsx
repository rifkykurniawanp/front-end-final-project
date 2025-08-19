import React from 'react';
import { notFound } from 'next/navigation';
import { productsApi } from '@/lib/API/products/products.api';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface ProductPageProps {
  params: { slug: string }; // ✅ just an object
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = params; // ✅ no await needed

  try {
    const product = await productsApi.getBySlug(slug);

    if (!product) {
      notFound();
    }

    return <ProductDetailClient product={product} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
};

export default ProductPage;

import React from 'react';
import { notFound } from 'next/navigation';
import { allProducts } from '@/app/data/product';
import { Product } from '@/types/product';
import { ProductDetailClient } from '@/app/(product)/components/ProductDetailClient';

async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return allProducts.find(product => product.slug === slug);
}

interface ProductPageProps {
  params: Promise<{ slug: string }>; // Changed: params is now a Promise
}

const ProductPage = async (props: ProductPageProps) => {
  const { slug } = await props.params; // Changed: await the params

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
};

export default ProductPage;
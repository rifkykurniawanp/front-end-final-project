// src/app/(product)/product/[slug]/page.tsx
import { productsApi } from "@/lib/API/products/products.api";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/ProductDetailClient"; // import client component
import { ProductWithRelations } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ slug: string }>; // ✅ params sekarang Promise
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params; // ✅ wajib pakai await

  try {
    const product: ProductWithRelations | null = await productsApi.getBySlug(slug);

    if (!product) return notFound();

    return <ProductDetailClient product={product} />;
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="p-6 text-red-500">
        Gagal memuat produk. Silakan coba lagi nanti.
      </div>
    );
  }
};

export default ProductPage;

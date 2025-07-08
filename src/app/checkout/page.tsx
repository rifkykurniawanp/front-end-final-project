"use client";

import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const CheckoutPage = () => {
  const { cart, total, itemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20 text-xl font-medium text-gray-600">
        Tidak ada produk dalam keranjang.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-6">
        {cart.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-4 items-start border-b pb-4">
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-md"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p>Jumlah: {quantity}</p>
              <p className="text-primary font-semibold">
                Subtotal: {formatCurrency(product.price * quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right space-y-2">
        <p>
          <strong>Total Item:</strong> {itemCount}
        </p>
        <p className="text-xl font-bold">
          Total Harga: {formatCurrency(total)}
        </p>
        <Button className="mt-4">Bayar Sekarang</Button>
      </div>
    </div>
  );
};

export default CheckoutPage;

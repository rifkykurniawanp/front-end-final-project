interface LineItem {
  id: number;
  name: string;
  qty: number;
  total: number;
}

export default function PaymentSummary({
  items,
  subtotal,
  discount = 0,
  total,
}: {
  items: LineItem[];
  subtotal: number;
  discount?: number;
  total: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Ringkasan Pesanan</h2>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between">
            <div className="truncate">
              <div className="text-sm font-medium">{it.name}</div>
              <div className="text-xs text-neutral-500">Qty: {it.qty}</div>
            </div>
            <div className="text-sm font-semibold">
              Rp {it.total.toLocaleString("id-ID")}
            </div>
          </div>
        ))}
        <div className="my-2 h-px w-full bg-neutral-200" />
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Diskon</span>
            <span>- Rp {discount.toLocaleString("id-ID")}</span>
          </div>
        )}
        <div className="mt-1 flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>
    </div>
  );
}

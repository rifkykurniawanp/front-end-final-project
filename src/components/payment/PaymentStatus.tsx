import type { PaymentResponse } from "@/types/payment";

export default function PaymentStatusView({
  response,
  paymentUrl,
}: {
  response: PaymentResponse;
  paymentUrl?: string;
}) {
  const isSuccess = response.success;
  const msg = response.message ?? (isSuccess ? "Pembayaran berhasil" : "Pembayaran gagal");

  return (
    <div className="rounded-xl border bg-white p-4 text-sm shadow-sm">
      <div className={`font-medium ${isSuccess ? "text-emerald-700" : "text-red-700"}`}>
        {msg}
      </div>
      {response.error && (
        <div className="mt-1 text-xs text-red-600">{response.error}</div>
      )}
      {paymentUrl && (
        <div className="mt-3">
          <a
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka halaman pembayaran
          </a>
          <div className="mt-1 text-xs text-neutral-500">
            (Untuk lingkungan lokal, klik tautan di atas secara manual)
          </div>
        </div>
      )}
      {response.transactionId && (
        <div className="mt-2 text-xs text-neutral-500">
          ID Transaksi: {response.transactionId}
        </div>
      )}
    </div>
  );
}

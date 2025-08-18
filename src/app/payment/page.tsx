"use client";
import { useEffect } from "react";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
  const { user, token } = useAuth();
  const {
    payments,
    loading,
    error,
    fetchUserPayments,
    createPayment,
    cancelPayment,
  } = usePayment(token as string);

  useEffect(() => {
    if (user) {
      fetchUserPayments(user.id);
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Daftar Pembayaran</h1>

      <Button
        onClick={() =>
          createPayment({ amount: 100000, type: "PRODUCT" } as any)
        }
      >
        Buat Payment Baru
      </Button>

      <ul className="space-y-2">
        {payments.map((p) => (
          <li
            key={p.id}
            className="border rounded p-2 flex justify-between items-center"
          >
            <span>
              #{p.id} - {p.status} - Rp{p.amount}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => cancelPayment(p.id)}
            >
              Batalkan
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import { useState } from "react";
import { paymentsApi } from "@/lib/API/core/payments.api";
import { Payment } from "@/types/payment";

export function usePayment(token: string) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ambil semua payment user
  const fetchUserPayments = async (userId: number) => {
    try {
      setLoading(true);
      const data = await paymentsApi.getUserPayments(userId, token);
      setPayments(data);
    } catch (err) {
      setError("Gagal mengambil pembayaran");
    } finally {
      setLoading(false);
    }
  };

  // buat payment baru
  const createPayment = async (data: Partial<Payment>) => {
    try {
      setLoading(true);
      const payment = await paymentsApi.create(data, token);
      setPayments((prev) => [...prev, payment]);
      return payment;
    } catch (err) {
      setError("Gagal membuat pembayaran");
    } finally {
      setLoading(false);
    }
  };

  // cancel payment
  const cancelPayment = async (id: number) => {
    try {
      setLoading(true);
      const updated = await paymentsApi.cancel(id, token);
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    } catch (err) {
      setError("Gagal membatalkan pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    fetchUserPayments,
    createPayment,
    cancelPayment,
  };
}

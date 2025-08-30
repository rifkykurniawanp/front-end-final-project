"use client";
import { useState } from "react";
import { paymentsApi } from "@/lib/API/core/payments.api";
import type {
  PaymentResponseDto,
  CreatePaymentDto,
  CancelPaymentDto,
} from "@/types/payment";

export function usePayment(token: string) {
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPayments = async (userId: number) => {
    try {
      setLoading(true);
      const data = await paymentsApi.getUserPayments(userId, token);
      setPayments(data);
    } catch {
      setError("Gagal mengambil pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (data: CreatePaymentDto) => {
    try {
      setLoading(true);
      const payment = await paymentsApi.create(data, token);
      setPayments((prev) => [...prev, payment]);
      return payment;
    } finally {
      setLoading(false);
    }
  };

  const cancelPayment = async (id: number, reason?: string) => {
    try {
      setLoading(true);
      const updated = await paymentsApi.cancel(
        id,
        { reason } as CancelPaymentDto,
        token
      );
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
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

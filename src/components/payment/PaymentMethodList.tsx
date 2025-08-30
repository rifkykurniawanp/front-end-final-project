"use client";
import React from "react";
import type { PaymentMethod } from "@/types/payment";

interface Props {
  methods: PaymentMethod[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function PaymentMethodList({ methods, selected, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {methods.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`w-full p-3 rounded-xl border ${
            selected === m.id ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <span className="font-medium">{m.name}</span> — {m.description}
        </button>
      ))}
    </div>
  );
}

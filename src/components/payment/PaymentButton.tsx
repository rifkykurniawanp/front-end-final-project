export default function PaymentButton({
  onClick,
  disabled,
  loading,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Memproses..." : label ?? "Bayar Sekarang"}
    </button>
  );
}

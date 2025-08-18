export default function PaymentForm({
  value,
  onChange,
}: {
  value: { name: string; email: string; phone?: string };
  onChange: (v: { name: string; email: string; phone?: string }) => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Data Pelanggan</h2>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm">Nama</label>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="Nama lengkap"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="email@contoh.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">No. HP (opsional)</label>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            value={value.phone ?? ""}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
          />
        </div>
      </div>
    </div>
  );
}

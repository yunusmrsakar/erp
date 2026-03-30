import { ArrowLeft, Save, Cog } from "lucide-react";
import Link from "next/link";
import { createEquipmentAction } from "../actions";

export default function NewEquipmentPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link
          href="/maintenance"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Ekipman / Demirbaş</h1>
          <p className="text-muted-foreground text-sm">Fabrikaya yeni bir makine veya demirbaş kaydedin.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6 relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5">
          <Cog className="h-32 w-32" />
        </div>
        <form action={createEquipmentAction} className="space-y-6 relative z-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ekipman Kodu</label>
              <input
                type="text"
                name="code"
                required
                placeholder="Örn: EQ-001"
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ekipman Adı</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Örn: CNC Tezgahı Model X"
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Seri Numarası</label>
              <input
                type="text"
                name="serialNumber"
                placeholder="Örn: SN-2024-00112"
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Konum / Hat</label>
              <input
                type="text"
                name="location"
                placeholder="Örn: Montaj Hattı A"
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Satın Alım Tarihi</label>
              <input
                type="date"
                name="purchaseDate"
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary h-11 px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Ekipmanı Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { ArrowLeft, Save, Wrench } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { createMaintenanceTaskAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewMaintenanceTaskPage() {
  const equipments = await prisma.equipment.findMany({
    where: { status: { not: "DECOMMISSIONED" } },
    orderBy: { name: "asc" },
  });

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Bakım İş Emri Aç</h1>
          <p className="text-muted-foreground text-sm">Ekipmana arıza veya periyodik bakım kaydı oluşturun.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6 relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-5">
          <Wrench className="h-32 w-32" />
        </div>
        <form action={createMaintenanceTaskAction} className="space-y-6 relative z-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Ekipman Seçin</label>
              <select
                name="equipmentId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="" disabled>-- Ekipman Seçin --</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>[{eq.code}] {eq.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bakım Tipi</label>
              <select
                name="taskType"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="PREVENTIVE">Önleyici (Periyodik)</option>
                <option value="BREAKDOWN">Arıza / Acil</option>
                <option value="INSPECTION">Periyodik Denetim</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Öncelik</label>
              <select
                name="priority"
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="LOW">Düşük</option>
                <option value="MEDIUM">Orta</option>
                <option value="HIGH">Yüksek</option>
                <option value="CRITICAL">KRİTİK</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Açıklama / Arıza Tanımı</label>
              <textarea
                name="description"
                rows={3}
                required
                placeholder="Örn: Sol yatakta aşınma tespit edildi, rulman değişimi gerekiyor..."
                className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tahmini Maliyet (₺)</label>
              <input
                type="number"
                name="cost"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground">İş emri tamamlandığında bu tutar FI Kasasından gider olarak düşülür.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Planlanan Tarih</label>
              <input
                type="date"
                name="scheduledDate"
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
              İş Emrini Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

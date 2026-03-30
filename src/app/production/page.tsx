import Link from "next/link";
import { Plus, Search, Hammer, CheckCircle, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { completeProductionAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const orders = await prisma.productionOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true }
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Üretim Zemin & Takip</h1>
          <p className="text-muted-foreground mt-1 text-sm">Üretim emirlerini başlatın ve fabrika durumunu izleyin.</p>
        </div>
        <Link 
          href="/production/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Üretim Emri
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Üretim No (PRD-) ara..." 
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Emir Numarası</th>
                <th className="px-6 py-4 font-semibold">Üretilecek Ürün</th>
                <th className="px-6 py-4 font-semibold text-center">Hedef Miktar</th>
                <th className="px-6 py-4 font-semibold">Başlangıç</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold text-right">Aksiyon (Fabrika Zemin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Hammer className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Açık bir üretim kaydı yok.</p>
                      <Link href="/production/new" className="text-primary hover:underline mt-2 text-sm font-medium">İlk iş emrini başlatın</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((po) => (
                  <tr key={po.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground font-mono">{po.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground line-clamp-1">{po.product.name}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{po.product.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-lg">x {po.quantity}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                      {po.startDate ? new Date(po.startDate).toLocaleDateString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </td>
                    <td className="px-6 py-4">
                       {po.status === "IN_PROGRESS" ? (
                         <span className="inline-flex flex-row items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500 ring-1 ring-inset ring-blue-500/20">
                           <Clock className="w-3.5 h-3.5 animate-spin-slow" /> Üretimde
                         </span>
                       ) : po.status === "COMPLETED" ? (
                         <span className="inline-flex flex-row items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-500 ring-1 ring-inset ring-green-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Tamamlandı
                         </span>
                       ) : (
                         <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-500 ring-1 ring-inset ring-gray-500/20">
                            İptal / Taslak
                         </span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       {po.status === "IN_PROGRESS" && (
                         <form action={completeProductionAction}>
                            <input type="hidden" name="orderId" value={po.id} />
                            <button 
                              type="submit" 
                              className="inline-flex items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 text-xs font-semibold shadow transition-colors w-full"
                            >
                              Üretimi Bitir (Depola)
                            </button>
                         </form>
                       )}
                       {po.status === "COMPLETED" && (
                          <span className="text-xs font-medium text-muted-foreground">Depoya Girdi (IN)</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

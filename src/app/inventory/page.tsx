import Link from "next/link";
import { Activity, ArrowRightLeft, TrendingUp, TrendingDown, PackageOpen } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InventoryMovementsPage() {
  const movements = await prisma.inventoryMovement.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true }
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Depo Hareketleri (Log)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Ürünlerin giriş, çıkış ve tüm transfer işlemlerinin tarihçesi.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold">Tip</th>
                <th className="px-6 py-4 font-semibold">İlgili Ürün</th>
                <th className="px-6 py-4 font-semibold">Miktar Değişimi</th>
                <th className="px-6 py-4 font-semibold">Referans / Açıklama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <PackageOpen className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Kayıtlı bir stok hareketi bulunamadı.</p>
                      <span className="text-xs mt-1">Sipariş alındığında veya satış yapıldığında log buraya teyit edilir.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                      {new Date(mov.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-6 py-4">
                      {mov.type === "IN" ? (
                        <span className="inline-flex items-center rounded-full bg-green-500/10 text-green-500 px-2.5 py-0.5 text-xs font-semibold">
                          <TrendingUp className="w-3 h-3 mr-1" /> GİRİŞ (RECEIPT)
                        </span>
                      ) : mov.type === "OUT" ? (
                        <span className="inline-flex items-center rounded-full bg-red-500/10 text-red-500 px-2.5 py-0.5 text-xs font-semibold">
                          <TrendingDown className="w-3 h-3 mr-1" /> ÇIKIŞ (ISSUE)
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 text-yellow-500 px-2.5 py-0.5 text-xs font-semibold">
                          <ArrowRightLeft className="w-3 h-3 mr-1" /> TRANSFER/DÜZELTME
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {mov.product.name}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`font-semibold ${mov.type === "IN" ? "text-green-500" : mov.type === "OUT" ? "text-red-500" : "text-yellow-500"}`}>
                        {mov.type === "IN" ? "+" : mov.type === "OUT" ? "-" : ""}{mov.quantity}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {mov.reference && <span className="font-mono text-xs text-foreground mb-1">{mov.reference}</span>}
                        {mov.notes && <span className="text-xs text-muted-foreground line-clamp-1">{mov.notes}</span>}
                      </div>
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

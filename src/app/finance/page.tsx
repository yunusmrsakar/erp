import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, RefreshCw, HandCoins, Building2, CreditCard } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const [transactions, pendingAR, pendingAP] = await Promise.all([
    prisma.financialTransaction.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.aggregate({
      where: { status: "SHIPPED", paymentStatus: "UNPAID" },
      _sum: { total: true }
    }),
    prisma.purchaseOrder.aggregate({
      where: { status: "RECEIVED", paymentStatus: "UNPAID" },
      _sum: { totalAmount: true }
    })
  ]);

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + t.amount, 0);
  const liquidCash = totalIncome - totalExpense;

  const expectedAR = pendingAR._sum.total || 0;
  const expectedAP = pendingAP._sum.totalAmount || 0;

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bilanço & Muhasebe (FI)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Gerçek zamanlı nakit akışı, ödenecek borçlar ve tahsilatlar.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
             <Wallet className="h-20 w-20 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Genel Merkez Kasa (Liquid)</span>
            <span className={`text-4xl font-bold tracking-tight ${liquidCash >= 0 ? "text-foreground" : "text-rose-500"}`}>
              ₺{liquidCash.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground mt-2">Kasadaki net aktif para</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
             <HandCoins className="h-20 w-20 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Bekleyen Alacak (AR)</span>
            <span className="text-4xl font-bold tracking-tight text-emerald-500">
              ₺{expectedAR.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground mt-2">Teslim edilmiş, tahsil edilecek siparişler</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
             <Building2 className="h-20 w-20 text-rose-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Ödenecek Borç (AP)</span>
            <span className="text-4xl font-bold tracking-tight text-rose-500">
              ₺{expectedAP.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground mt-2">Tedarikçilere vadesi gelmiş borçlar</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Kasa / Yevmiye Ekstresi
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold">İşlem Tipi</th>
                <th className="px-6 py-4 font-semibold">Tutar</th>
                <th className="px-6 py-4 font-semibold">Açıklama / Referans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Kasa şu an boş. Herhangi bir finansal hareket (Tahsilat/Ödeme) yok.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {new Date(t.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-6 py-4">
                      {t.type === "INCOME" ? (
                        <span className="inline-flex items-center rounded-sm bg-green-500/10 text-green-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          <TrendingUp className="w-3 h-3 mr-1" /> GELİR
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-sm bg-red-500/10 text-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          <TrendingDown className="w-3 h-3 mr-1" /> GİDER
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 font-bold ${t.type === "INCOME" ? "text-green-500" : "text-red-500"}`}>
                      {t.type === "INCOME" ? "+" : "-"} ₺{t.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="text-foreground font-medium">{t.description}</span>
                        <span className="text-muted-foreground font-mono mt-0.5">Ref: {t.referenceId || "-"}</span>
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

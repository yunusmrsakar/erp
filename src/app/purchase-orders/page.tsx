import Link from "next/link";
import { Plus, Search, CheckCircle, PackageSearch, PackagePlus, Wallet } from "lucide-react";
import prisma from "@/lib/prisma";
import { receiveOrderAction } from "./actions";
import { payVendorAction } from "../finance/actions";

export const dynamic = "force-dynamic";

export default async function PurchaseOrdersPage() {
  const purchaseOrders = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vendor: true,
      items: { include: { product: true } }
    }
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Satın Alma Siparişleri (PO)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Tedarikçilerden yapılan mal alımları ve stok girişleri.</p>
        </div>
        <Link 
          href="/purchase-orders/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Satın Alma Siparişi
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="PO no veya tedarikçi ara..." 
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">PO Numarası</th>
                <th className="px-6 py-4 font-semibold">Tedarikçi Firma</th>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold">Mal Durumu</th>
                <th className="px-6 py-4 font-semibold">Finans Durumu</th>
                <th className="px-6 py-4 font-semibold text-right">Maliyet Tutarı</th>
                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <PackageSearch className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Kayıtlı bir satın alma siparişi bulunamadı.</p>
                      <Link href="/purchase-orders/new" className="text-primary hover:underline mt-2 text-sm font-medium">Satın Alma İletin</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground font-mono">
                      #{po.poNumber}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {po.vendor.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(po.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        po.status === "RECEIVED" ? "bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20" :
                        "bg-yellow-500/10 text-yellow-500 ring-1 ring-inset ring-yellow-500/20"
                      }`}>
                        {po.status === "RECEIVED" ? "Stoklara Eklendi" : "Beklemede"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {po.status === "RECEIVED" && (
                         <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                           po.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500 text-white animate-pulse"
                         }`}>
                           {po.paymentStatus === "PAID" ? "Fatura Ödendi" : "BORÇ AÇIK"}
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground text-right">
                      ₺{po.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {po.status !== "RECEIVED" && (
                          <form action={receiveOrderAction}>
                            <input type="hidden" name="poId" value={po.id} />
                            <button 
                              type="submit" 
                              className="inline-flex items-center justify-center rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1.5 text-xs font-semibold transition-colors border border-green-500/20"
                              title="Ürünleri Depoya Kabul Et"
                            >
                              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                              Mal Kabul
                            </button>
                          </form>
                        )}
                        {po.status === "RECEIVED" && po.paymentStatus === "UNPAID" && (
                          <form action={payVendorAction}>
                            <input type="hidden" name="poId" value={po.id} />
                            <button 
                              type="submit" 
                              className="inline-flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 text-xs font-semibold transition-colors shadow-sm"
                              title="Tedarikçiye Ödemeyi Yap"
                            >
                              <Wallet className="mr-1.5 h-3.5 w-3.5" />
                              Ödeme Çık
                            </button>
                          </form>
                        )}
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

import Link from "next/link";
import { Plus, Search, CheckCircle, ShoppingCart, FileText, Send, Wallet } from "lucide-react";
import prisma from "@/lib/prisma";
import { convertToOrderAction, shipOrderAction } from "./actions";
import { receivePaymentAction } from "../finance/actions";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      items: { include: { product: true } }
    }
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Satış & Teklif Yönetimi (SD)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Müşteri teklifleri, onaylanan siparişler ve teslimat süreçleri.</p>
        </div>
        <Link 
          href="/orders/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Belge (Teklif/Sipariş)
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Sipariş/Teklif no, müşteri ara..." 
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Kayıt No</th>
                <th className="px-6 py-4 font-semibold">Tasarım / Durum</th>
                <th className="px-6 py-4 font-semibold">Müşteri</th>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold text-right">Tutar</th>
                <th className="px-6 py-4 font-semibold text-right">Aksiyon & Çıktı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingCart className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Henüz satış yapılmadı veya teklif verilmedi.</p>
                      <Link href="/orders/new" className="text-primary hover:underline mt-2 text-sm font-medium">İlk teklifi oluşturun</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground font-mono">
                      <Link href={`/orders/${order.id}/print`} className="hover:text-primary hover:underline" target="_blank">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                         <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                           order.type === "QUOTATION" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                         }`}>
                           {order.type === "QUOTATION" ? "TEKLİF" : "SİPARİŞ (SO)"}
                         </span>
                         
                         <div className="flex gap-1">
                           <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                             order.status === "SHIPPED" ? "bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20" :
                             order.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 ring-1 ring-inset ring-yellow-500/20" :
                             order.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20" :
                             "bg-secondary text-foreground"
                           }`}>
                             {order.status === "SHIPPED" ? "Teslim Edildi" : 
                              order.status === "PENDING" ? "Onay Bekliyor" : 
                              order.status === "CONFIRMED" ? "Sipariş Onaylandı" : order.status}
                           </span>
                           {order.type === "ORDER" && order.status === "SHIPPED" && (
                             <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                               order.paymentStatus === "PAID" ? "bg-green-500 text-white" : "bg-rose-500 text-white animate-pulse"
                             }`}>
                               {order.paymentStatus === "PAID" ? "ÖDENDİ" : "BEKLEYEN ÖDEME"}
                             </span>
                           )}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-foreground font-medium line-clamp-1">{order.customer.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{order.customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      {order.validUntil && (
                        <div className="text-[10px] mt-0.5 text-rose-500">Miat: {new Date(order.validUntil).toLocaleDateString("tr-TR")}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground text-right whitespace-nowrap">
                      ₺{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {order.type === "ORDER" && order.status === "SHIPPED" && order.paymentStatus === "UNPAID" && (
                           <form action={receivePaymentAction}>
                             <input type="hidden" name="orderId" value={order.id} />
                             <button type="submit" className="inline-flex items-center justify-center rounded-md bg-green-500 text-white hover:bg-green-600 px-2.5 py-1.5 text-xs font-semibold transition-colors shadow-sm" title="Parayı Kasaya Aktar (Tahsil Et)">
                               <Wallet className="mr-1 h-3.5 w-3.5" /> Tahsil Et
                             </button>
                           </form>
                        )}

                        {order.type === "QUOTATION" && order.status === "PENDING" && (
                           <form action={convertToOrderAction}>
                             <input type="hidden" name="orderId" value={order.id} />
                             <button type="submit" className="inline-flex items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-2.5 py-1.5 text-xs font-semibold transition-colors border border-emerald-500/20" title="Siparişe Dönüştür (Müşteri Kabul Etti)">
                               <CheckCircle className="mr-1 h-3.5 w-3.5" /> Onayla
                             </button>
                           </form>
                        )}
                        
                        {order.type === "ORDER" && order.status === "CONFIRMED" && (
                           <form action={shipOrderAction}>
                             <input type="hidden" name="orderId" value={order.id} />
                             <button type="submit" className="inline-flex items-center justify-center rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white px-2.5 py-1.5 text-xs font-semibold transition-colors border border-orange-500/20" title="Kargola (Stoklardan Çık ve İrsaliye Kes)">
                               <Send className="mr-1 h-3.5 w-3.5" /> Gönder
                             </button>
                           </form>
                        )}

                        <Link href={`/orders/${order.id}/print`} target="_blank" className="inline-flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-muted px-2.5 py-1.5 text-xs font-semibold transition-colors border border-border" title="PDF Fatura / Teklif Çıktısı">
                          <FileText className="h-3.5 w-3.5" />
                        </Link>
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

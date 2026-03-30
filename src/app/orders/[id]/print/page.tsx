import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function OrderPrintPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) notFound();

  const isQuote = order.type === "QUOTATION";

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <div className="max-w-[800px] mx-auto p-8 lg:p-12 relative print:max-w-none print:p-0">
        
        {/* Hide from Print */}
        <div className="absolute top-4 right-4 print:hidden flex gap-2">
           <PrintButton />
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              NEXUS <span className="text-slate-500">ERP</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">İleri Teknoloji Kurumsal Sistemleri A.Ş.</p>
            <div className="mt-4 text-sm text-slate-600">
               <p>Büyükdere Cad. No: 123 Kat: 4</p>
               <p>Levent, Şişli / İstanbul</p>
               <p>info@nexuserp.com | +90 212 555 0000</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-light text-slate-400 uppercase tracking-widest mb-2">
              {isQuote ? "Teklif" : "Fatura İrsaliye"}
            </h2>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-8">
                <span className="font-semibold text-slate-500">BELGE NO:</span>
                <span className="font-mono text-slate-900 font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="font-semibold text-slate-500">TARİH:</span>
                <span className="text-slate-900">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              {order.validUntil && (
                <div className="flex justify-between gap-8">
                  <span className="font-semibold text-slate-500">{isQuote ? "GEÇERLİLİK:" : "VADE:"}</span>
                  <span className="text-slate-900">{new Date(order.validUntil).toLocaleDateString("tr-TR")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">MÜŞTERİ BİLGİLERİ</h3>
          <div className="text-slate-900">
            <p className="text-lg font-bold">{order.customer.name}</p>
            {order.customer.company && <p className="text-sm">{order.customer.company}</p>}
            {order.customer.email && <p className="text-sm">{order.customer.email}</p>}
            {order.customer.phone && <p className="text-sm">{order.customer.phone}</p>}
            {order.customer.address && <p className="text-sm whitespace-pre-line mt-1">{order.customer.address}</p>}
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left mb-10 border-collapse">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="py-3 text-sm font-bold text-slate-900">AÇIKLAMA / HİZMET</th>
              <th className="py-3 text-sm font-bold text-slate-900 text-center">ADET</th>
              <th className="py-3 text-sm font-bold text-slate-900 text-right">BİRİM FİYAT</th>
              <th className="py-3 text-sm font-bold text-slate-900 text-right">TUTAR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-4 text-sm text-slate-900">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {item.product.sku}</p>
                </td>
                <td className="py-4 text-sm text-slate-800 text-center">{item.quantity}</td>
                <td className="py-4 text-sm text-slate-800 text-right">₺{item.price.toFixed(2)}</td>
                <td className="py-4 text-sm text-slate-900 font-bold text-right">₺{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mb-12">
          <div className="w-64">
            <div className="flex justify-between py-2 text-sm border-b border-slate-200">
              <span className="text-slate-600">Ara Toplam:</span>
              <span className="text-slate-900 font-medium">₺{order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-b border-slate-200">
              <span className="text-slate-600">KDV (18%):</span>
              <span className="text-slate-900 font-medium">₺{(order.total * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold">
              <span className="text-slate-900">GENEL TOPLAM:</span>
              <span className="text-slate-900">₺{(order.total * 1.18).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="text-sm text-slate-500 border-t-2 border-slate-800 pt-6">
          {order.notes ? (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-800 mb-1">Müşteri Notu:</h4>
              <p>{order.notes}</p>
            </div>
          ) : null}
          <div className="flex justify-between opacity-60">
             <p>{isQuote ? "Bu teklif yukarıda belirtilen süreye kadar geçerlidir." : "Bizi tercih ettiğiniz için teşekkür ederiz."}</p>
             <p className="font-mono text-xs">Mali değeri {isQuote ? "yoktur." : "vardır."}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

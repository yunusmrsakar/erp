import Link from "next/link";
import { Plus, Search, MoreHorizontal, Users } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } }
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Müşteriler</h1>
          <p className="text-muted-foreground mt-1 text-sm">Bireysel ve kurumsal müşteri portföyünüzü yönetin.</p>
        </div>
        <Link 
          href="/customers/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Müşteri Ekle
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="İsim, şirket veya e-posta ara..." 
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Müşteri</th>
                <th className="px-6 py-4 font-semibold">Şirket</th>
                <th className="px-6 py-4 font-semibold">İletişim</th>
                <th className="px-6 py-4 font-semibold">Sipariş Sayısı</th>
                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Kayıtlı müşteri bulunamadı.</p>
                      <Link href="/customers/new" className="text-primary hover:underline mt-2 text-sm font-medium">Yeni Müşteri Oluştur</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                          {customer.name.substring(0,2).toUpperCase()}
                        </div>
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.company || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-foreground">{customer.email}</span>
                        {customer.phone && <span className="text-xs text-muted-foreground">{customer.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                        {customer._count.orders} Sipariş
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
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

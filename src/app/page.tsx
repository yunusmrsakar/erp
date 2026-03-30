import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Activity, DollarSign } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [transactions, totalCustomers, totalOrders, recentOrders] = await Promise.all([
    prisma.financialTransaction.findMany(),
    prisma.customer.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: true }
    })
  ]);

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + t.amount, 0);
  const revenue = totalIncome - totalExpense;

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">İşletmenizin genel durumu ve son aktiviteler canli veri.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-row items-center justify-between pb-3">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Kasadaki Tahsilat (Net)</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className={`text-3xl font-bold ${revenue < 0 ? 'text-red-500' : ''}`}>₺{revenue.toFixed(2)}</div>
          <p className="text-[11px] font-semibold text-green-500 flex items-center mt-2">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            Bilanço (FI) Verisi
          </p>
        </div>
        
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-row items-center justify-between pb-3">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Toplam Müşteri</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{totalCustomers}</div>
          <p className="text-[11px] font-semibold text-green-500 flex items-center mt-2">
            Canlı Veridir
          </p>
        </div>
        
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-row items-center justify-between pb-3">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Sipariş Sayısı</h3>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{totalOrders}</div>
          <p className="text-[11px] font-semibold text-green-500 flex items-center mt-2">
            Canlı Veridir
          </p>
        </div>
        
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-row items-center justify-between pb-3">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Sistem Durumu</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">5 / 5</div>
          <p className="text-[11px] font-semibold text-green-500 flex items-center mt-2">
            %100 Aktif
          </p>
        </div>
      </div>
      
      {/* Charts & Tables Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-8">
            <h3 className="font-semibold leading-none tracking-tight">Ciro Özeti</h3>
            <p className="text-sm text-muted-foreground pt-1">Aylık bazda genel performans grafiği.</p>
          </div>
          <div className="h-[350px]">
            <OverviewChart />
          </div>
        </div>
        
        <div className="col-span-3 rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 pb-8">
            <h3 className="font-semibold leading-none tracking-tight">Son Siparişler</h3>
            <p className="text-sm text-muted-foreground pt-1">En son tamamlanan müşteri işlemleri.</p>
          </div>
          <div className="space-y-7">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">Henüz sipariş yok.</p>
            ) : recentOrders.map((order, i) => (
              <div key={order.id} className="flex items-center group">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary font-semibold border border-border transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                  {order.customer.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">{order.customer.name}</p>
                  <p className="text-[13px] text-muted-foreground">{order.customer.email}</p>
                </div>
                <div className="ml-auto font-medium text-foreground tracking-tight">+₺{order.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { BarChart2, TrendingUp, Presentation } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gelişmiş Raporlar</h1>
        <p className="text-muted-foreground mt-1 text-sm">Aylık, yıllık performansınızı ve analizlerinizi görüntüleyin.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Satış Büyümesi</p>
              <h4 className="text-2xl font-bold">+12.5%</h4>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Genel Dönüşüm</p>
              <h4 className="text-2xl font-bold">4.2%</h4>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Presentation className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Aktif Modüller</p>
              <h4 className="text-2xl font-bold">Performanslı</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Yıllık Satış Projeksiyonu</h3>
          <p className="text-sm text-muted-foreground">Recharts ile oluşturulmuş 12 aylık örnek veri analizi.</p>
        </div>
        <div className="h-[400px]">
          <OverviewChart />
        </div>
      </div>
    </div>
  );
}

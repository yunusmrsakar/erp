import Link from "next/link";
import { Plus, Wrench, CheckCircle, Clock, AlertTriangle, XCircle, Cog } from "lucide-react";
import prisma from "@/lib/prisma";
import { completeMaintenanceTaskAction } from "./actions";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  OPERATIONAL: { label: "Çalışıyor", className: "bg-green-500/10 text-green-500 ring-green-500/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  UNDER_MAINTENANCE: { label: "Bakımda", className: "bg-amber-500/10 text-amber-500 ring-amber-500/20", icon: <Wrench className="w-3.5 h-3.5" /> },
  DECOMMISSIONED: { label: "Hizmet Dışı", className: "bg-red-500/10 text-red-500 ring-red-500/20", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const priorityConfig: Record<string, string> = {
  LOW: "bg-slate-500/10 text-slate-400",
  MEDIUM: "bg-blue-500/10 text-blue-400",
  HIGH: "bg-amber-500/10 text-amber-500",
  CRITICAL: "bg-red-500/10 text-red-500",
};

export default async function MaintenancePage() {
  const [equipments, openTasks] = await Promise.all([
    prisma.equipment.findMany({
      orderBy: { createdAt: "desc" },
      include: { tasks: { where: { status: { not: "DONE" } } } },
    }),
    prisma.maintenanceTask.findMany({
      where: { status: { not: "DONE" } },
      orderBy: { createdAt: "desc" },
      include: { equipment: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bakım & Onarım (PM)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Fabrika ekipmanları ve makine bakım iş emirleri yönetimi.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/maintenance/task/new"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Bakım İş Emri Aç
          </Link>
          <Link
            href="/maintenance/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekipman Ekle
          </Link>
        </div>
      </div>

      {/* Open Tasks Alert */}
      {openTasks.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-500">{openTasks.length} Açık Bakım İş Emri Var</p>
            <p className="text-xs text-muted-foreground mt-0.5">Aşağıdaki tabloda bekleyen, acil iş emirlerini görebilirsiniz.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Equipment List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ekipman Kataloğu</h2>
          {equipments.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
              <Cog className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Henüz ekipman yok.</p>
              <Link href="/maintenance/new" className="text-xs text-primary hover:underline mt-2 inline-block">İlk ekipmanı ekle</Link>
            </div>
          ) : (
            equipments.map((eq) => {
              const cfg = statusConfig[eq.status] || statusConfig.OPERATIONAL;
              return (
                <div key={eq.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-foreground">{eq.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{eq.code}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${cfg.className}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  {eq.location && <p className="text-xs text-muted-foreground">📍 {eq.location}</p>}
                  {eq.tasks.length > 0 && (
                    <p className="text-xs text-amber-500 mt-2 font-medium">{eq.tasks.length} açık iş emri</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Maintenance Tasks */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Aktif İş Emirleri</h2>
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">İş Emri</th>
                    <th className="px-4 py-3 font-semibold">Ekipman</th>
                    <th className="px-4 py-3 font-semibold">Öncelik</th>
                    <th className="px-4 py-3 font-semibold">Maliyet</th>
                    <th className="px-4 py-3 font-semibold">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {openTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500/50" />
                        <p>Tüm iş emirleri tamamlandı!</p>
                      </td>
                    </tr>
                  ) : (
                    openTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs font-bold text-foreground">{task.taskNumber}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{task.equipment.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] uppercase font-bold ${priorityConfig[task.priority] || priorityConfig.MEDIUM}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {task.cost ? `₺${task.cost.toFixed(2)}` : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <form action={completeMaintenanceTaskAction}>
                            <input type="hidden" name="taskId" value={task.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700 px-2.5 py-1.5 text-xs font-semibold transition-colors"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" /> Tamamla
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

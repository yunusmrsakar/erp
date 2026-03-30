import prisma from "@/lib/prisma";
import { CheckCircle, XCircle, Clock, FlaskConical } from "lucide-react";
import { inspectQualityAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function QualityPage() {
  const inspections = await prisma.qualityInspection.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pending = inspections.filter((i) => i.status === "PENDING");
  const completed = inspections.filter((i) => i.status !== "PENDING");

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Kalite Yönetimi (QM)</h1>
        <p className="text-muted-foreground mt-1 text-sm">Üretim ve satın alma partilerinin kalite denetim sonuçlarını kaydedin.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Bekleyen Denetim</p>
          <p className="text-3xl font-bold text-foreground mt-1">{pending.length}</p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5">
          <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">Onaylanan (PASSED)</p>
          <p className="text-3xl font-bold text-foreground mt-1">{inspections.filter((i) => i.status === "PASSED").length}</p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Reddedilen (FAILED)</p>
          <p className="text-3xl font-bold text-foreground mt-1">{inspections.filter((i) => i.status === "FAILED").length}</p>
        </div>
      </div>

      {/* Pending Inspections */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" /> Bekleyen Kalite Kontrol Formları
          </h2>
          <div className="space-y-4">
            {pending.map((insp) => (
              <div key={insp.id} className="rounded-xl border border-amber-500/30 bg-card shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-foreground text-sm">{insp.inspectionNumber}</span>
                    <span className="mx-2 text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{insp.referenceType === "PRODUCTION" ? "Üretim Emri" : "Satın Alma"}: {insp.referenceNumber}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{insp.quantity} adet</span>
                </div>
                <form action={inspectQualityAction} className="p-4 flex flex-col sm:flex-row gap-4">
                  <input type="hidden" name="inspectionId" value={insp.id} />
                  <textarea
                    name="result"
                    rows={2}
                    placeholder="Denetim notu (isteğe bağlı)..."
                    className="flex-1 rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                  <div className="flex gap-3 items-end">
                    <button
                      type="submit"
                      name="status"
                      value="PASSED"
                      className="inline-flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-sm font-semibold transition-colors"
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" /> Onayla (PASSED)
                    </button>
                    <button
                      type="submit"
                      name="status"
                      value="FAILED"
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 px-4 py-2 text-sm font-semibold transition-colors"
                    >
                      <XCircle className="mr-1.5 h-4 w-4" /> Reddet (FAILED)
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Inspections */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Tamamlanan Denetimler</h2>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold">Denetim No</th>
                  <th className="px-6 py-3 font-semibold">Kaynak</th>
                  <th className="px-6 py-3 font-semibold">Miktar</th>
                  <th className="px-6 py-3 font-semibold">Sonuç</th>
                  <th className="px-6 py-3 font-semibold">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completed.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      <FlaskConical className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                      <p>Henüz tamamlanan denetim yok.</p>
                    </td>
                  </tr>
                ) : (
                  completed.map((insp) => (
                    <tr key={insp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs font-bold text-foreground">{insp.inspectionNumber}</td>
                      <td className="px-6 py-3 text-muted-foreground">
                        <span className="text-xs">{insp.referenceType === "PRODUCTION" ? "Üretim" : "Satın Alma"}</span>
                        <span className="block font-mono text-xs text-foreground">{insp.referenceNumber}</span>
                      </td>
                      <td className="px-6 py-3">{insp.quantity}</td>
                      <td className="px-6 py-3">
                        {insp.status === "PASSED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-500">
                            <CheckCircle className="h-3 w-3" /> Onaylandı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-500">
                            <XCircle className="h-3 w-3" /> Reddedildi
                          </span>
                        )}
                        {insp.result && <p className="text-xs text-muted-foreground mt-1 italic">{insp.result}</p>}
                      </td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">
                        {insp.inspectedAt ? new Date(insp.inspectedAt).toLocaleDateString("tr-TR") : "-"}
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
  );
}

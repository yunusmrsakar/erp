import Link from "next/link";
import { Plus, Search, UserCheck, Briefcase, CreditCard, Banknote } from "lucide-react";
import prisma from "@/lib/prisma";
import { paySalaryAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function HRPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { hireDate: "desc" },
    include: { payrolls: true }
  });

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">İnsan Kaynakları & Bordro (HR)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Personel bilgileri, departmanlar ve maaş ödeme işlemleri.</p>
        </div>
        <Link 
          href="/hr/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          İşe Alım / Personel Ekle
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Personel adı, e-posta veya departman ara..." 
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Personel</th>
                <th className="px-6 py-4 font-semibold">Departman & Pozisyon</th>
                <th className="px-6 py-4 font-semibold">İşe Giriş</th>
                <th className="px-6 py-4 font-semibold text-right">Aylık Net Maaş</th>
                <th className="px-6 py-4 font-semibold text-center">Bordro ({currentMonth}/{currentYear})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Briefcase className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Sistemde kayıtlı personel bulunamadı.</p>
                      <Link href="/hr/new" className="text-primary hover:underline mt-2 text-sm font-medium">İlk personeli ekleyin</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const isPaidThisMonth = emp.payrolls.some(p => p.month === currentMonth && p.year === currentYear && p.status === "PAID");

                  return (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary font-bold">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold line-clamp-1">{emp.firstName} {emp.lastName}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                         <span className="text-foreground font-medium">{emp.department}</span>
                         <span className="text-xs text-muted-foreground">{emp.position}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(emp.hireDate).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground text-right whitespace-nowrap">
                      ₺{emp.salary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isPaidThisMonth ? (
                        <div className="inline-flex items-center text-xs font-semibold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-md">
                          <UserCheck className="w-4 h-4 mr-1.5" /> Ödendi
                        </div>
                      ) : (
                        <form action={paySalaryAction}>
                          <input type="hidden" name="employeeId" value={emp.id} />
                          <button 
                            type="submit" 
                            className="inline-flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600 px-3 py-1.5 text-xs font-semibold transition-colors shadow-sm w-full"
                          >
                            <Banknote className="mr-1.5 h-3.5 w-3.5" /> Maaş Yatır (FI)
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

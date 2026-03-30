import { ArrowLeft, Save, Briefcase } from "lucide-react";
import Link from "next/link";
import { createEmployeeAction } from "../actions";

export const dynamic = "force-dynamic";

export default function NewEmployeePage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/hr" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Personel Girişi</h1>
          <p className="text-muted-foreground text-sm">İşe alım belgesi, departman ve maaş tanımlama ekranı.</p>
        </div>
      </div>
      
      <div className="rounded-xl border border-border bg-card shadow-sm p-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 p-8 opacity-5">
           <Briefcase className="h-40 w-40" />
        </div>
        
        <form action={createEmployeeAction} className="space-y-6 relative z-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Adı</label>
              <input 
                type="text" 
                name="firstName" 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="Örn. Ali"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Soyadı</label>
              <input 
                type="text" 
                name="lastName" 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="Örn. Yılmaz"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">E-posta</label>
              <input 
                type="email" 
                name="email" 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="ali.yilmaz@nexuserp.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Telefon</label>
              <input 
                type="tel" 
                name="phone" 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="+90 555 123 4567"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-border grid gap-6 sm:grid-cols-2">
             <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Departman (Modül Yetkisi)</label>
              <select 
                name="department" 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                required
              >
                 <option value="" disabled>-- Seçiniz --</option>
                 <option value="Satış (SD)">Satış & Dağıtım (SD)</option>
                 <option value="Depo (MM)">Lojistik & Depo (MM)</option>
                 <option value="Finans (FI)">Muhasebe & Finans (FI)</option>
                 <option value="Yönetim">Üst Yönetim (Executive)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Görev / Pozisyon</label>
              <input 
                type="text" 
                name="position" 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="Örn. Depo Sorumlusu"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border pb-2">
             <div className="space-y-2 max-w-xs">
              <label className="text-sm font-medium leading-none text-foreground">Net Maaş Tutarı (₺)</label>
              <input 
                type="number" 
                name="salary" 
                step="0.01"
                min="0"
                defaultValue="17002.12"
                className="flex h-12 w-full rounded-md border-2 border-primary/20 bg-background/50 px-3 py-2 text-lg font-bold text-primary ring-offset-background focus-visible:outline-none focus-visible:border-primary"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Bu miktar FI modülünde Kasa'dan periyodik bordro gideri olarak düşülecektir.</p>
          </div>

          <button 
            type="submit" 
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-primary h-11 px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Personeli Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}

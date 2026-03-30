import { ArrowLeft, Play, AlertCircle } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { createProductionAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductionOrderPage({
  searchParams,
}: {
  searchParams: { error?: string, item?: string, req?: string, has?: string }
}) {
  // Only fetch products that actually have a BOM formulation
  const productsWithBom = await prisma.product.findMany({
    where: {
      asFinishedGood: { some: {} }
    },
    include: {
      asFinishedGood: {
        include: { rawMaterial: true }
      }
    }
  });

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/production" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Üretime Başla (İş Emri)</h1>
          <p className="text-muted-foreground text-sm">Üretim bandına reçeteli bir iş emri gönderin.</p>
        </div>
      </div>
      
      {searchParams.error === "INSUFFICIENT_STOCK" && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-600 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p>Üretim Emri Reddedildi: Stok Yetersiz!</p>
            <p className="text-sm text-red-600/80 mt-1 font-normal">Bu üretimi karşılayacak kadar <strong>{searchParams.item}</strong> yok. İstenen: {searchParams.req}, Mevcut: {searchParams.has}.</p>
          </div>
        </div>
      )}

      {searchParams.error === "NO_BOM" && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-600 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Seçilen ürün için kayıtlı bir reçete (BOM) bulunamadı!</p>
        </div>
      )}
      
      <div className="rounded-xl border border-border bg-card shadow-sm p-6 overflow-hidden">
        <form action={createProductionAction} className="space-y-6">
          <div className="space-y-2">
             <label className="text-sm font-medium leading-none text-foreground">Üretilecek (Hedef) Ürün</label>
             <select 
               name="finishedProductId" 
               className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
               required
             >
                <option value="" disabled>-- Üretime Açık Ürün Seç --</option>
                {productsWithBom.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name} (Hâlâ {p.asFinishedGood.length} malzeme)
                  </option>
                ))}
             </select>
             {productsWithBom.length === 0 && (
               <p className="text-xs text-red-500 mt-1">Önce /bom sekmesinden geçerli bir ürün reçetesi (BOM) tanımlamalısınız!</p>
             )}
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium leading-none text-foreground">Üretim Miktarı (Adet)</label>
             <input 
               type="number" 
               name="quantity" 
               min="1"
               defaultValue="1"
               className="flex h-11 w-full rounded-md border-2 border-primary/20 bg-background/50 px-3 py-2 text-lg font-bold text-primary ring-offset-background focus-visible:outline-none focus-visible:border-primary"
               required
             />
             <p className="text-xs text-muted-foreground mt-1">Girdiğiniz adet x reçetedeki hammaddeler formülü hesaplanıp deponuzdan eksiltilecektir.</p>
          </div>

          <div className="border-t border-border pt-6">
             <button 
               type="submit" 
               disabled={productsWithBom.length === 0}
               className="inline-flex w-full items-center justify-center rounded-lg bg-primary h-12 text-base font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Play className="mr-2 h-4 w-4" />
               Fabrika Üretimini Gerçekleştir
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

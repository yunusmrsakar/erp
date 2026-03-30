import Link from "next/link";
import { Plus, Search, Layers, FlaskConical } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BOMPage() {
  const bomItems = await prisma.bOMItem.findMany({
    include: {
      finishedProduct: true,
      rawMaterial: true
    }
  });

  // Group by finished product
  const bomsByProduct = bomItems.reduce((acc, curr) => {
    if (!acc[curr.finishedProductId]) {
      acc[curr.finishedProductId] = {
        product: curr.finishedProduct,
        items: []
      };
    }
    acc[curr.finishedProductId].items.push(curr);
    return acc;
  }, {} as Record<string, { product: any, items: any[] }>);

  const bomList = Object.values(bomsByProduct);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ürün Reçeteleri (BOM)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Satılabilir ürünlerin hammadde üretim formüllerini yönetin.</p>
        </div>
        <Link 
          href="/bom/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Üretim Reçetesi (BOM)
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bomList.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <FlaskConical className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Henüz Reçete Yok</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
               Sisteminizde tanımlı hiçbir üretim formülü (Bill of Materials) yok. Yeni bir reçete tanımlayarak fabrikasyonu başlatın.
            </p>
            <Link 
              href="/bom/new" 
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              İlk Reçeteyi Tanımla
            </Link>
          </div>
        ) : (
          bomList.map((bom) => (
            <div key={bom.product.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <Layers className="h-5 w-5" />
                     </div>
                     <div>
                        <h3 className="font-bold text-foreground leading-tight">{bom.product.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{bom.product.sku}</p>
                     </div>
                  </div>
               </div>
               <div className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Reçete Formülü (1 Adet İçin)</h4>
                  <ul className="space-y-2">
                     {bom.items.map((item, idx) => (
                       <li key={idx} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                          <span className="text-foreground">{item.rawMaterial.name}</span>
                          <span className="font-mono text-muted-foreground text-xs bg-muted px-1.5 py-0.5 rounded">x {item.quantity}</span>
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="p-4 bg-muted/10 border-t border-border flex justify-end">
                  <Link href="/production/new" className="text-xs font-semibold text-primary hover:underline">
                     Bu Ürünü Üret →
                  </Link>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

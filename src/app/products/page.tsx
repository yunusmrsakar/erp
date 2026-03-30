import Link from "next/link";
import { Plus, Search, MoreHorizontal, Package } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Stok & Ürünler</h1>
          <p className="text-muted-foreground mt-1 text-sm">Envanterinizdeki tüm ürünleri ve stok durumlarını yönetin.</p>
        </div>
        <Link 
          href="/products/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Ürün adı veya SKU ara..." 
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Ürün Adı</th>
                <th className="px-6 py-4 font-semibold">SKU / Barkod</th>
                <th className="px-6 py-4 font-semibold">Tip</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Fiyat</th>
                <th className="px-6 py-4 font-semibold">Stok Durumu</th>
                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-10 w-10 mb-3 text-muted-foreground/50" />
                      <p>Kayıtlı ürün bulunamadı.</p>
                      <Link href="/products/new" className="text-primary hover:underline mt-2 text-sm font-medium">Hemen ilk ürünü ekleyin</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                        product.productType === "RAW_MATERIAL" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {product.productType === "RAW_MATERIAL" ? "HAM MADDE" : "B. ÜRÜN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold bg-background group-hover:bg-muted transition-colors">
                        {product.category || "Genel"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">₺{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {product.stock > 10 ? (
                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                          {product.stock} Adet
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                          Düşük Stok ({product.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20">
                          Tükendi
                        </span>
                      )}
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
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-muted/10">
          <span>Toplam {products.length} ürün gösteriliyor.</span>
        </div>
      </div>
    </div>
  );
}

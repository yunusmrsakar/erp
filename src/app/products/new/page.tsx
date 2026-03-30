import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

async function createProduct(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const category = formData.get("category") as string;
  const productType = formData.get("productType") as string;
  const description = formData.get("description") as string;

  await prisma.product.create({
    data: { name, sku, price, stock, category, productType, description },
  });

  redirect("/products");
}

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/products" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Ürün Ekle</h1>
          <p className="text-muted-foreground text-sm">Sisteme yeni bir stok kalemi tanımlayın.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <form action={createProduct} className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Temel Bilgiler</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none text-foreground">Ürün Adı</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Örn: Kablosuz Kulaklık Model X"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sku" className="text-sm font-medium leading-none text-foreground">SKU / Barkod Kodu</label>
                <input 
                  type="text" 
                  id="sku" 
                  name="sku" 
                  required 
                  placeholder="Örn: KULK-X-001"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none text-foreground">Kısa Açıklama (İsteğe Bağlı)</label>
              <textarea 
                id="description" 
                name="description" 
                rows={3}
                placeholder="Ürün hakkında kısa bilgi..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Fiyatlandırma ve Stok</h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <label htmlFor="productType" className="text-sm font-medium leading-none text-foreground">Ürün Tipi</label>
                <select 
                  id="productType" 
                  name="productType" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                >
                  <option value="FINISHED_GOOD">Tamamlanmış Ürün</option>
                  <option value="RAW_MATERIAL">Ham Madde / Malzeme</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium leading-none text-foreground">Satış Fiyatı (₺)</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  min="0"
                  step="0.01"
                  required 
                  placeholder="0.00"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium leading-none text-foreground">Başlangıç Stoğu</label>
                <input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  min="0"
                  required 
                  placeholder="Adet girin"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium leading-none text-foreground">Kategori</label>
                <select 
                  id="category" 
                  name="category" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                >
                  <option value="Elektronik">Elektronik</option>
                  <option value="Giyim">Giyim</option>
                  <option value="Hizmet">Hizmet</option>
                  <option value="Yazılım">Yazılım</option>
                  <option value="Donanım">Donanım</option>
                  <option value="Ahşap/Mobilya">Ahşap/Mobilya</option>
                  <option value="Metal">Metal</option>
                  <option value="Genel">Genel</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link 
              href="/products" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              İptal
            </Link>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Ürünü Kaydet
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

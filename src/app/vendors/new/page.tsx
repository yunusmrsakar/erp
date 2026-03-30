import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

async function createVendor(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const vendorCode = `VND-${Date.now().toString().slice(-5)}`; // Auto generated code

  await prisma.vendor.create({
    data: { name, email, phone, address, vendorCode },
  });

  redirect("/vendors");
}

export default function NewVendorPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/vendors" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Tedarikçi Ekle</h1>
          <p className="text-muted-foreground text-sm">Sisteme yeni bir toptancı / tedarikçi ana verisi tanımlayın.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <form action={createVendor} className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Kurumsal İletişim</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="name" className="text-sm font-medium leading-none text-foreground">Firma Ünvanı *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Örn: ABC Teknolojik Ürünler Tedarik A.Ş."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">E-posta Adresi</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="satis@firma.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium leading-none text-foreground">Telefon Numarası</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  placeholder="+90 5XX XXX XX XX"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label htmlFor="address" className="text-sm font-medium leading-none text-foreground">Açık Adres & Tesis</label>
              <textarea 
                id="address" 
                name="address" 
                rows={3}
                placeholder="Depo adresi veya merkez ofis..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link 
              href="/vendors" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              İptal
            </Link>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Tedarikçiyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

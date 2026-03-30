import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

async function createCustomer(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const address = formData.get("address") as string;

  await prisma.customer.create({
    data: { name, email, phone, company, address },
  });

  redirect("/customers");
}

export default function NewCustomerPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/customers" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Müşteri Ekle</h1>
          <p className="text-muted-foreground text-sm">CRM sistemimize yeni bir müşteri kaydı oluşturun.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <form action={createCustomer} className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Kişisel & Kurumsal İletişim</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none text-foreground">Ad Soyad / Yetkili</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Örn: Yunus Emre Sakar"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">E-posta Adresi</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="isim@sirket.com"
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
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium leading-none text-foreground">Şirket Ünvanı</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company"
                  placeholder="Opsiyonel şirket adı"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label htmlFor="address" className="text-sm font-medium leading-none text-foreground">Fatura & Gönderim Adresi</label>
              <textarea 
                id="address" 
                name="address" 
                rows={3}
                placeholder="Açık adres..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link 
              href="/customers" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              İptal
            </Link>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Müşteriyi Kaydet
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

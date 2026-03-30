import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import POForm from "./POForm";

export const dynamic = "force-dynamic";

export default async function NewPOPage() {
  const [vendors, products] = await Promise.all([
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/purchase-orders" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Satın Alma Siparişi</h1>
          <p className="text-muted-foreground text-sm">Tedarikçi seçin ve stok alınacak ürünleri listeye ekleyin.</p>
        </div>
      </div>
      
      <POForm vendors={vendors} products={products} />
    </div>
  );
}

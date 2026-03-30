import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import OrderForm from "./OrderForm";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const [customers, products] = await Promise.all([
    prisma.customer.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { stock: { gt: 0 } }, orderBy: { name: "asc" } })
  ]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/orders" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Sipariş Oluştur</h1>
          <p className="text-muted-foreground text-sm">Müşteri seçin, stoktan ürün ekleyin ve faturayı kesin.</p>
        </div>
      </div>
      
      <OrderForm customers={customers} products={products} />
    </div>
  );
}

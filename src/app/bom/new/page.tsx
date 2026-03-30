import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import BOMForm from "./BOMForm";

export const dynamic = "force-dynamic";

export default async function NewBOMPage() {
  const [finishedGoods, rawMaterials] = await Promise.all([
    prisma.product.findMany({ where: { productType: "FINISHED_GOOD" }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { productType: "RAW_MATERIAL" }, orderBy: { name: "asc" } })
  ]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/bom" 
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Yeni Üretim Reçetesi (BOM)</h1>
          <p className="text-muted-foreground text-sm">Bir ürünün hangi hammaddelerden oluştuğunu formülize edin.</p>
        </div>
      </div>
      
      <BOMForm finishedGoods={finishedGoods} rawMaterials={rawMaterials} />
    </div>
  );
}

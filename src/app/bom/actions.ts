"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createBomAction(formData: FormData) {
  const finishedProductId = formData.get("finishedProductId") as string;
  const rawMaterialsStr = formData.get("rawMaterials") as string;
  
  if (!finishedProductId || !rawMaterialsStr) return;

  const rawMaterials = JSON.parse(rawMaterialsStr) as { rawMaterialId: string, quantity: number }[];
  if (rawMaterials.length === 0) return;

  // Clear existing BOM for this product if resetting (for MVP we'll just delete existing)
  await prisma.bOMItem.deleteMany({
    where: { finishedProductId }
  });

  await prisma.bOMItem.createMany({
    data: rawMaterials.map(rm => ({
      finishedProductId,
      rawMaterialId: rm.rawMaterialId,
      quantity: rm.quantity
    }))
  });

  redirect("/bom");
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function receiveOrderAction(formData: FormData) {
  const poId = formData.get("poId") as string;
  if (!poId) return;

  const po = await prisma.purchaseOrder.findUnique({
    where: { id: poId },
    include: { items: true }
  });

  if (!po || po.status === "RECEIVED") return;

  // Transaction for Goods Receipt (Mal Kabul)
  await prisma.$transaction(async (tx) => {
    // 1. Mark PO as processed
    await tx.purchaseOrder.update({
      where: { id: poId },
      data: { status: "RECEIVED" }
    });

    // 2. Add Stock and Create Inventory Movement Log
    for (const item of po.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      });

      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          type: "IN",
          quantity: item.quantity,
          reference: po.poNumber,
          notes: "Tedarikçiden Satın Alma (PO) Kabulü"
        }
      });
    }
  });

  revalidatePath("/purchase-orders");
  revalidatePath("/inventory");
  revalidatePath("/products");
}

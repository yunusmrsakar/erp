"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function convertToOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { type: "ORDER", status: "CONFIRMED" }
  });

  revalidatePath("/orders");
}

export async function shipOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order || order.status === "SHIPPED") return;

  await prisma.$transaction(async (tx) => {
    // 1. Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" }
    });

    // 2. Decrement stock (Goods Issue) and log
    for (const item of order.items) {
      // Check if stock is sufficient, though normally validated at order. We just force decrement here.
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });

      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          type: "OUT",
          quantity: item.quantity,
          reference: order.orderNumber,
          notes: "Müşteriye Sevk (Goods Issue)"
        }
      });
    }
  });

  revalidatePath("/orders");
  revalidatePath("/inventory");
  revalidatePath("/products");
}

"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createPurchaseOrderAction(formData: FormData) {
  const vendorId = formData.get("vendorId") as string;
  const cartDataStr = formData.get("cartData") as string;
  const total = parseFloat(formData.get("total") as string);

  if (!vendorId || !cartDataStr) return;

  const cart = JSON.parse(cartDataStr) as { product: {id: string}, quantity: number, unitCost: number }[];
  if (cart.length === 0) return;

  const poNumber = `PO-${Date.now().toString().slice(-6)}`;

  await prisma.purchaseOrder.create({
    data: {
      poNumber,
      vendorId,
      totalAmount: total,
      status: "DRAFT",
      items: {
        create: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitCost: item.unitCost
        }))
      }
    }
  });

  redirect("/purchase-orders");
}

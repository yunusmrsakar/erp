"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createOrderAction(formData: FormData) {
  const customerId = formData.get("customerId") as string;
  const cartDataStr = formData.get("cartData") as string;
  const total = parseFloat(formData.get("total") as string);
  const type = formData.get("type") as string || "QUOTATION";
  const validUntilStr = formData.get("validUntil") as string;
  const notes = formData.get("notes") as string;

  if (!customerId || !cartDataStr) return;

  const cart = JSON.parse(cartDataStr) as { product: {id: string, price: number}, quantity: number }[];
  if (cart.length === 0) return;

  const prefix = type === "QUOTATION" ? "QT" : "SO";
  const orderNumber = `${prefix}-${Date.now().toString().slice(-6)}`;

  await prisma.order.create({
    data: {
      orderNumber,
      customerId,
      total,
      type,
      status: type === "QUOTATION" ? "PENDING" : "CONFIRMED",
      validUntil: validUntilStr ? new Date(validUntilStr) : null,
      notes,
      items: {
        create: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }
    }
  });

  redirect("/orders");
}

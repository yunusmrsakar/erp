"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function receivePaymentAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) return;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.paymentStatus === "PAID") return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID" }
    });

    await tx.financialTransaction.create({
      data: {
        type: "INCOME",
        amount: order.total,
        referenceId: order.orderNumber,
        referenceType: "SALE",
        description: `${order.orderNumber} nolu siparişin müşteri tahsilatı`
      }
    });
  });

  revalidatePath("/orders");
  revalidatePath("/finance");
}

export async function payVendorAction(formData: FormData) {
  const poId = formData.get("poId") as string;
  if (!poId) return;

  const po = await prisma.purchaseOrder.findUnique({ where: { id: poId } });
  if (!po || po.paymentStatus === "PAID") return;

  await prisma.$transaction(async (tx) => {
    await tx.purchaseOrder.update({
      where: { id: poId },
      data: { paymentStatus: "PAID" }
    });

    await tx.financialTransaction.create({
      data: {
        type: "EXPENSE",
        amount: po.totalAmount,
        referenceId: po.poNumber,
        referenceType: "PURCHASE",
        description: `${po.poNumber} nolu Mal Alım faturasının ödemesi`
      }
    });
  });

  revalidatePath("/purchase-orders");
  revalidatePath("/finance");
}

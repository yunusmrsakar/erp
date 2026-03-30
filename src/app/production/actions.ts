"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProductionAction(formData: FormData) {
  const finishedProductId = formData.get("finishedProductId") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  
  if (!finishedProductId || isNaN(quantity) || quantity <= 0) return;

  // 1. Get BOM for this product
  const bomItems = await prisma.bOMItem.findMany({
    where: { finishedProductId },
    include: { rawMaterial: true }
  });

  if (bomItems.length === 0) {
     redirect("/production/new?error=NO_BOM");
  }

  // 2. Validate Raw Material Stocks
  for (const item of bomItems) {
     const requiredAmount = item.quantity * quantity;
     if (item.rawMaterial.stock < requiredAmount) {
         redirect(`/production/new?error=INSUFFICIENT_STOCK&item=${item.rawMaterial.name}&req=${requiredAmount}&has=${item.rawMaterial.stock}`);
     }
  }

  // 3. Create Production Order (IN_PROGRESS)
  const orderNumber = `PRD-${Date.now().toString().slice(-6)}`;
  
  await prisma.productionOrder.create({
     data: {
       orderNumber,
       productId: finishedProductId,
       quantity,
       status: "IN_PROGRESS",
       startDate: new Date(),
     }
  });

  redirect("/production");
}

export async function completeProductionAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) return;

  const order = await prisma.productionOrder.findUnique({
    where: { id: orderId }
  });

  if (!order || order.status !== "IN_PROGRESS") return;

  // 1. Get BOM formula
  const bomItems = await prisma.bOMItem.findMany({
    where: { finishedProductId: order.productId }
  });

  await prisma.$transaction(async (tx) => {
    // 2. Deduct Raw Materials (OUT)
    for (const item of bomItems) {
       const deduction = item.quantity * order.quantity;
       
       await tx.product.update({
         where: { id: item.rawMaterialId },
         data: { stock: { decrement: deduction } }
       });

       await tx.inventoryMovement.create({
         data: {
           productId: item.rawMaterialId,
           type: "OUT",
           quantity: deduction,
           reference: `PRODUCTION-${order.orderNumber}`,
           notes: `Üretim Sarfiyatı (${order.orderNumber})`
         }
       });
    }

    // 3. Add Finished Good (IN)
    await tx.product.update({
       where: { id: order.productId },
       data: { stock: { increment: order.quantity } }
    });

    await tx.inventoryMovement.create({
      data: {
         productId: order.productId,
         type: "IN",
         quantity: order.quantity,
         reference: `PRODUCTION-${order.orderNumber}`,
         notes: `Üretimden Giriş (${order.orderNumber})`
      }
    });

    // 4. Mark Production as COMPLETED
    await tx.productionOrder.update({
      where: { id: orderId },
      data: { 
        status: "COMPLETED",
        endDate: new Date()
      }
    });

    // 5. Auto-create QM Inspection (PENDING) for this production batch
    await tx.qualityInspection.create({
      data: {
        inspectionNumber: `QI-${Date.now().toString().slice(-6)}`,
        referenceType: "PRODUCTION",
        referenceId: orderId,
        referenceNumber: order.orderNumber,
        productId: order.productId,
        quantity: order.quantity,
        status: "PENDING",
      }
    });
  });

  revalidatePath("/production");
  revalidatePath("/inventory");
  revalidatePath("/quality");
}

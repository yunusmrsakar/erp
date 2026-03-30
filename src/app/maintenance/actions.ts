"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createEquipmentAction(formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const location = formData.get("location") as string;
  const purchaseDateStr = formData.get("purchaseDate") as string;

  if (!code || !name) return;

  await prisma.equipment.create({
    data: {
      code,
      name,
      serialNumber: serialNumber || null,
      location: location || null,
      purchaseDate: purchaseDateStr ? new Date(purchaseDateStr) : null,
    },
  });

  redirect("/maintenance");
}

export async function createMaintenanceTaskAction(formData: FormData) {
  const equipmentId = formData.get("equipmentId") as string;
  const taskType = formData.get("taskType") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const costStr = formData.get("cost") as string;
  const scheduledDateStr = formData.get("scheduledDate") as string;

  if (!equipmentId || !taskType || !description) return;

  const cost = costStr ? parseFloat(costStr) : null;
  const taskNumber = `MNT-${Date.now().toString().slice(-6)}`;

  await prisma.maintenanceTask.create({
    data: {
      taskNumber,
      equipmentId,
      taskType,
      description,
      priority,
      cost,
      scheduledDate: scheduledDateStr ? new Date(scheduledDateStr) : null,
    },
  });

  redirect("/maintenance");
}

export async function completeMaintenanceTaskAction(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const notes = formData.get("notes") as string;
  if (!taskId) return;

  const task = await prisma.maintenanceTask.findUnique({
    where: { id: taskId },
    include: { equipment: true },
  });

  if (!task) return;

  await prisma.$transaction(async (tx) => {
    // 1. Mark task as DONE
    await tx.maintenanceTask.update({
      where: { id: taskId },
      data: {
        status: "DONE",
        completedDate: new Date(),
        notes: notes || null,
      },
    });

    // 2. If cost recorded → auto-post to FI as EXPENSE
    if (task.cost && task.cost > 0) {
      await tx.financialTransaction.create({
        data: {
          type: "EXPENSE",
          amount: task.cost,
          referenceId: task.id,
          referenceType: "MAINTENANCE",
          description: `Bakım Masrafı: ${task.equipment.name} - ${task.taskNumber}`,
        },
      });
    }
  });

  revalidatePath("/maintenance");
  revalidatePath("/finance");
}

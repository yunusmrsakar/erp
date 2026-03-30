"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function inspectQualityAction(formData: FormData) {
  const inspectionId = formData.get("inspectionId") as string;
  const status = formData.get("status") as string; // PASSED or FAILED
  const result = formData.get("result") as string;

  if (!inspectionId || !status) return;

  await prisma.qualityInspection.update({
    where: { id: inspectionId },
    data: {
      status,
      result: result || null,
      inspectedAt: new Date(),
    },
  });

  revalidatePath("/quality");
}

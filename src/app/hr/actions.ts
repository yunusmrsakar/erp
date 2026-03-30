"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createEmployeeAction(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const department = formData.get("department") as string;
  const position = formData.get("position") as string;
  const salary = parseFloat(formData.get("salary") as string);

  if (!firstName || !lastName || !email || !department || !position || !salary) return;

  await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary
    }
  });

  redirect("/hr");
}

export async function paySalaryAction(formData: FormData) {
  const employeeId = formData.get("employeeId") as string;
  if (!employeeId) return;

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }
  });

  if (!employee) return;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Check if already paid this month
  const existingPayroll = await prisma.payroll.findFirst({
    where: {
      employeeId,
      month: currentMonth,
      year: currentYear,
      status: "PAID"
    }
  });

  if (existingPayroll) return; // Already paid

  await prisma.$transaction(async (tx) => {
    // 1. Create Paid Payroll
    const payroll = await tx.payroll.create({
      data: {
        employeeId,
        month: currentMonth,
        year: currentYear,
        baseAmount: employee.salary,
        netAmount: employee.salary, // Assuming no deductions for MVP
        status: "PAID",
        paymentDate: new Date()
      }
    });

    // 2. Post to Financial Ledger (FI)
    await tx.financialTransaction.create({
      data: {
        type: "EXPENSE",
        amount: employee.salary,
        referenceId: payroll.id,
        referenceType: "PAYROLL",
        description: `${employee.firstName} ${employee.lastName} - ${currentMonth}/${currentYear} Maaş Ödemesi`
      }
    });
  });

  revalidatePath("/hr");
  revalidatePath("/finance");
}

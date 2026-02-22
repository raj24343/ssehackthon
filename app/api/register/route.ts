import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rollNo, year, branch, phone, screenshot } = body;

    if (!name || !rollNo || !year || !branch || !phone) {
      return NextResponse.json(
        { error: "Name, Roll No, Year, Branch, and Phone are required" },
        { status: 400 }
      );
    }

    if (!screenshot) {
      return NextResponse.json(
        { error: "Payment screenshot is required" },
        { status: 400 }
      );
    }

    const yearNum = Number(year);
    if (![1, 2, 3].includes(yearNum)) {
      return NextResponse.json(
        { error: "Year must be 1, 2, or 3" },
        { status: 400 }
      );
    }

    const normalizedRollNo = String(rollNo).trim().toUpperCase();
    const existing = await prisma.student.findUnique({ where: { rollNo: normalizedRollNo } });
    if (existing) {
      return NextResponse.json(
        { error: "A student with this roll number is already registered" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name: String(name).trim(),
        rollNo: normalizedRollNo,
        year: yearNum,
        branch: String(branch).trim(),
        phone: String(phone).trim(),
        screenshot,
      },
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Registration error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Unique constraint") || msg.includes("duplicate key")) {
      return NextResponse.json(
        { error: "A student with this roll number is already registered" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to register. Please try again." },
      { status: 500 }
    );
  }
}

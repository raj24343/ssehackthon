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

    if (!screenshot || typeof screenshot !== "string") {
      return NextResponse.json(
        { error: "Payment screenshot is required (paste or upload and convert to string)" },
        { status: 400 }
      );
    }
    // Ensure screenshot is a valid base64 data URL string
    const screenshotStr = String(screenshot).trim();
    if (!screenshotStr.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid screenshot format. Please upload or paste a valid image." },
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
        screenshot: screenshotStr,
      },
    });

    return NextResponse.json({ success: true, student });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const prismaCode = (error as { code?: string })?.code;
    const msg = error instanceof Error ? error.message : String(error);
    if (prismaCode === "P2021" || prismaCode === "P2022" || (msg.includes("does not exist") && msg.includes("database"))) {
      return NextResponse.json(
        { error: "Database tables not found. Run: npx prisma db push" },
        { status: 503 }
      );
    }
    if (msg.includes("Unique constraint") || msg.includes("duplicate key")) {
      return NextResponse.json(
        { error: "A student with this roll number is already registered" },
        { status: 400 }
      );
    }
    if (msg.includes("Can't reach database") || msg.includes("connect ECONNREFUSED") || msg.includes("Connection")) {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later or contact support." },
        { status: 503 }
      );
    }
    if (msg.includes("relation") && msg.includes("does not exist")) {
      return NextResponse.json(
        { error: "Database not set up. Please run: npx prisma db push" },
        { status: 503 }
      );
    }
    if (msg.includes("DATABASE_URL")) {
      return NextResponse.json(
        { error: "Server configuration error: Database URL not set." },
        { status: 503 }
      );
    }
    const userMessage =
      process.env.NODE_ENV === "development"
        ? `Registration failed: ${msg}`
        : "Failed to register. Please try again.";
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}

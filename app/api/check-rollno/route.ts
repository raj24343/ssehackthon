import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rollNo = searchParams.get("rollNo");

  if (!rollNo) {
    return NextResponse.json({ error: "rollNo required" }, { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { rollNo: String(rollNo).trim().toUpperCase() },
      include: { team: true },
    });

    if (!student) {
      return NextResponse.json({ exists: false, registered: false });
    }

    return NextResponse.json({
      exists: true,
      registered: true,
      inTeam: !!student.teamId,
      teamName: student.team?.name,
    });
  } catch (error) {
    console.error("Check rollno error:", error);
    return NextResponse.json({ error: "Failed to check" }, { status: 500 });
  }
}

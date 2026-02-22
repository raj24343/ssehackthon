import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamName, rollNumbers } = body;

    if (!teamName || !rollNumbers || !Array.isArray(rollNumbers)) {
      return NextResponse.json(
        { error: "Team name and roll numbers (array) are required" },
        { status: 400 }
      );
    }

    const normalizedRollNos = rollNumbers
      .map((r: string) => String(r).trim().toUpperCase())
      .filter(Boolean);

    if (normalizedRollNos.length < 4 || normalizedRollNos.length > 5) {
      return NextResponse.json(
        { error: "Team must have 4 to 5 members" },
        { status: 400 }
      );
    }

    const students = await prisma.student.findMany({
      where: { rollNo: { in: normalizedRollNos } },
      include: { team: true },
    });

    if (students.length !== normalizedRollNos.length) {
      const found = students.map((s: { rollNo: string }) => s.rollNo);
      const missing = normalizedRollNos.filter((r: string) => !found.includes(r));
      return NextResponse.json(
        {
          error: `Roll numbers not found or not registered: ${missing.join(", ")}. Please register first.`,
        },
        { status: 400 }
      );
    }

    const alreadyInTeam = students.filter((s: { teamId: string | null }) => s.teamId);
    if (alreadyInTeam.length > 0) {
      return NextResponse.json(
        {
          error: `These students are already in a team: ${alreadyInTeam.map((s: { rollNo: string }) => s.rollNo).join(", ")}. A student cannot be in multiple teams.`,
        },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name: teamName,
        students: {
          connect: students.map((s: { id: string }) => ({ id: s.id })),
        },
      },
      include: { students: true },
    });

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Team creation error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Unique constraint") || msg.includes("duplicate key")) {
      return NextResponse.json(
        { error: "A team with this name may already exist, or a student is in multiple teams." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create team. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: { students: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(teams);
  } catch (error: unknown) {
    console.error("Fetch teams error:", error);
    const prismaCode = (error as { code?: string })?.code;
    if (prismaCode === "P2021" || prismaCode === "P2022") {
      return NextResponse.json({ teams: [], error: "Run: npx prisma db push" }, { status: 200 });
    }
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

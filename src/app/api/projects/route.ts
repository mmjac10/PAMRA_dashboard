import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ProjectSummary } from "@/types/project";

export async function GET() {
  const projects = await db.project.findMany({
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      cost: true,
      health: true,
      status: true,
      type: true,
      workDoneAmount: true,
      percentWorkDone: true,
      subengineer: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const data: ProjectSummary[] = projects.map((project) => ({
    id: project.id,
    name: project.name,
    latitude: project.latitude,
    longitude: project.longitude,
    cost: Number(project.cost),
    subengineerName: project.subengineer.name,
    health: project.health,
    status: project.status,
    type: project.type,
    workDoneAmount: project.workDoneAmount !== null ? Number(project.workDoneAmount) : null,
    percentWorkDone: project.percentWorkDone,
  }));

  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { idParamSchema } from "@/lib/validation";
import type { ProjectDetail } from "@/types/project";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const parsed = idParamSchema.safeParse(await params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const project = await db.project.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      name: true,
      cost: true,
      status: true,
      health: true,
      subengineer: { select: { name: true, contact: true } },
      milestones: {
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          targetDate: true,
          achievedDate: true,
          targetValue: true,
          achievedValue: true,
        },
        orderBy: { targetDate: "asc" },
      },
      bottlenecks: {
        select: {
          id: true,
          description: true,
          createdAt: true,
          photos: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      sitePhotos: {
        select: { id: true, weekOf: true },
        orderBy: { weekOf: "desc" },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const data: ProjectDetail = {
    id: project.id,
    name: project.name,
    cost: Number(project.cost),
    status: project.status,
    health: project.health,
    subengineerName: project.subengineer.name,
    subengineerContact: project.subengineer.contact,
    milestones: project.milestones.map((milestone) => ({
      id: milestone.id,
      type: milestone.type,
      title: milestone.title,
      description: milestone.description,
      targetDate: milestone.targetDate?.toISOString() ?? null,
      achievedDate: milestone.achievedDate?.toISOString() ?? null,
      targetValue: milestone.targetValue !== null ? Number(milestone.targetValue) : null,
      achievedValue: milestone.achievedValue !== null ? Number(milestone.achievedValue) : null,
    })),
    bottlenecks: project.bottlenecks.map((bottleneck) => ({
      id: bottleneck.id,
      description: bottleneck.description,
      createdAt: bottleneck.createdAt.toISOString(),
      photoIds: bottleneck.photos.map((photo) => photo.id),
    })),
    sitePhotos: project.sitePhotos.map((photo) => ({
      id: photo.id,
      weekOf: photo.weekOf.toISOString(),
    })),
  };

  return NextResponse.json(data);
}

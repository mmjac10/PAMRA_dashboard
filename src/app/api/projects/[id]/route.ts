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
      latitude: true,
      longitude: true,
      cost: true,
      status: true,
      health: true,
      location: true,
      adminApproval: true,
      workOrderAmount: true,
      workDoneAmount: true,
      percentWorkDone: true,
      scopeItems: {
        select: { item: true, quantity: true, progress: true },
        orderBy: { order: "asc" },
      },
      subengineer: { select: { name: true } },
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
    latitude: project.latitude,
    longitude: project.longitude,
    cost: Number(project.cost),
    status: project.status,
    health: project.health,
    subengineerName: project.subengineer.name,
    location: project.location,
    adminApproval: project.adminApproval !== null ? Number(project.adminApproval) : null,
    workOrderAmount: project.workOrderAmount !== null ? Number(project.workOrderAmount) : null,
    workDoneAmount: project.workDoneAmount !== null ? Number(project.workDoneAmount) : null,
    percentWorkDone: project.percentWorkDone,
    scopeOfWork: project.scopeItems,
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

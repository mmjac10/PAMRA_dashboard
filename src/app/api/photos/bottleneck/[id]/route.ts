import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { idParamSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const parsed = idParamSchema.safeParse(await params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid photo id" }, { status: 400 });
  }

  const photo = await db.bottleneckPhoto.findUnique({
    where: { id: parsed.data.id },
    select: { imageData: true, contentType: true },
  });

  if (!photo) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(photo.imageData), {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "private, max-age=86400",
    },
  });
}

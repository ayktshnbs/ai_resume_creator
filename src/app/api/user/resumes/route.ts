import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(
    resumes.map((r) => ({
      id: r.id,
      title: r.title,
      data: JSON.parse(r.data),
      template: r.template ? JSON.parse(r.template) : null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    id?: string;
    title?: string;
    data: Record<string, unknown>;
    template?: Record<string, unknown>;
  };

  const dataStr = JSON.stringify(body.data);
  const templateStr = body.template ? JSON.stringify(body.template) : null;

  if (body.id) {
    const existing = await prisma.resume.findFirst({
      where: { id: body.id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = await prisma.resume.update({
      where: { id: body.id },
      data: {
        title: body.title ?? existing.title,
        data: dataStr,
        template: templateStr ?? existing.template,
      },
    });
    return NextResponse.json({ id: updated.id });
  }

  const created = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: body.title || "Untitled Resume",
      data: dataStr,
      template: templateStr,
    },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await req.json()) as { id: string };

  const existing = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

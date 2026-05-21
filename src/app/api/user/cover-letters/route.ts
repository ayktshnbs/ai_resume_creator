import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const letters = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(
    letters.map((l) => ({
      id: l.id,
      title: l.title,
      data: JSON.parse(l.data),
      templateId: l.templateId,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
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
    templateId?: string;
  };

  const dataStr = JSON.stringify(body.data);

  if (body.id) {
    const existing = await prisma.coverLetter.findFirst({
      where: { id: body.id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = await prisma.coverLetter.update({
      where: { id: body.id },
      data: {
        title: body.title ?? existing.title,
        data: dataStr,
        templateId: body.templateId ?? existing.templateId,
      },
    });
    return NextResponse.json({ id: updated.id });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, planExpiresAt: true },
  });
  const isPro = user?.plan === "pro" && (!user.planExpiresAt || new Date(user.planExpiresAt) > new Date());

  if (!isPro) {
    const count = await prisma.coverLetter.count({ where: { userId: session.user.id } });
    if (count >= 1) {
      return NextResponse.json(
        { error: "Free plan allows 1 cover letter. Upgrade to Pro for unlimited." },
        { status: 403 },
      );
    }
  }

  const created = await prisma.coverLetter.create({
    data: {
      userId: session.user.id,
      title: body.title || "Untitled Cover Letter",
      data: dataStr,
      templateId: body.templateId,
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

  const existing = await prisma.coverLetter.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.coverLetter.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

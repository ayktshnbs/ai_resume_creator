/**
 * Carries a guest's used quota into their new account on signup / first sign-in.
 *
 * Without this, a guest who exports 1 free resume, signs up, and signs in
 * would receive a fresh quota of 1 free resume — defeating the limit.
 *
 * Idempotent: a GuestSession is migrated at most once (tracked via
 * `migratedToUserId`). Safe to call from multiple auth events.
 */

import { prisma } from "@/lib/prisma";
import { readGuestCookie } from "./crypto";

export async function migrateGuestToUser(
  guestCookieRaw: string | undefined,
  userId: string
): Promise<{ migrated: boolean; counters?: { resume: number; cover_letter: number } }> {
  const cookieId = await readGuestCookie(guestCookieRaw);
  if (!cookieId) return { migrated: false };

  const guest = await prisma.guestSession.findUnique({ where: { cookieId } });
  if (!guest || guest.migratedToUserId) return { migrated: false };

  const counters = {
    resume: guest.resumeExports,
    cover_letter: guest.coverLetterExports
  };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        resumeExports: { increment: counters.resume },
        coverLetterExports: { increment: counters.cover_letter }
      }
    }),
    prisma.guestSession.update({
      where: { cookieId },
      data: { migratedToUserId: userId }
    })
  ]);

  return { migrated: true, counters };
}

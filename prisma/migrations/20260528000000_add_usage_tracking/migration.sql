-- AlterTable: add export counters to User
ALTER TABLE "User" ADD COLUMN "resumeExports" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "coverLetterExports" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "GuestSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cookieId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "uaHash" TEXT NOT NULL,
    "resumeExports" INTEGER NOT NULL DEFAULT 0,
    "coverLetterExports" INTEGER NOT NULL DEFAULT 0,
    "migratedToUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestSession_cookieId_key" ON "GuestSession"("cookieId");
CREATE INDEX "GuestSession_ipHash_idx" ON "GuestSession"("ipHash");
CREATE INDEX "GuestSession_migratedToUserId_idx" ON "GuestSession"("migratedToUserId");

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "delta" INTEGER NOT NULL DEFAULT 1,
    "ipHash" TEXT NOT NULL,
    "uaHash" TEXT NOT NULL,
    "token" TEXT,
    "refundedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "UsageEvent_actorType_actorId_createdAt_idx" ON "UsageEvent"("actorType", "actorId", "createdAt");
CREATE INDEX "UsageEvent_ipHash_createdAt_idx" ON "UsageEvent"("ipHash", "createdAt");
CREATE INDEX "UsageEvent_token_idx" ON "UsageEvent"("token");

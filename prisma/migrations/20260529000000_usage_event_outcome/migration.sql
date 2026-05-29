-- AlterTable: track outcome on every consume attempt
ALTER TABLE "UsageEvent" ADD COLUMN "outcome" TEXT NOT NULL DEFAULT 'consumed';

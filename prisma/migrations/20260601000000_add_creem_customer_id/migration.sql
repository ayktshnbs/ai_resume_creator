-- AlterTable: capture the Creem customer id at subscription time so we
-- can mint a customer-portal link later (for cancel / manage).
ALTER TABLE "User" ADD COLUMN "creemCustomerId" TEXT;

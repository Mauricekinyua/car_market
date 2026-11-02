/*
  Warnings:

  - The `status` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'SOLD', 'HIDDEN');

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "status",
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE';

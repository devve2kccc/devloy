/*
  Warnings:

  - You are about to drop the column `type` on the `service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service" DROP COLUMN "type",
ADD COLUMN     "env" JSONB,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "networks" JSONB,
ADD COLUMN     "port" INTEGER,
ADD COLUMN     "volumes" JSONB;

-- DropEnum
DROP TYPE "ServiceType";

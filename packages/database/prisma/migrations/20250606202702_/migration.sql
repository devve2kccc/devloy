/*
  Warnings:

  - You are about to drop the column `env` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `networks` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `port` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `volumes` on the `service` table. All the data in the column will be lost.
  - The `status` column on the `service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,environmentId]` on the table `service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('DATABASE', 'CACHE', 'APPLICATION', 'CUSTOM_DOCKER');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('PENDING', 'DEPLOYING', 'RUNNING', 'STOPPED', 'FAILED', 'DELETING', 'UNKNOWN');

-- AlterTable
ALTER TABLE "service" DROP COLUMN "env",
DROP COLUMN "image",
DROP COLUMN "networks",
DROP COLUMN "port",
DROP COLUMN "volumes",
ADD COLUMN     "buildCommand" TEXT,
ADD COLUMN     "exposedPort" INTEGER,
ADD COLUMN     "lastDeploymentAt" TIMESTAMP(3),
ADD COLUMN     "lastDeploymentLog" TEXT,
ADD COLUMN     "repository" TEXT,
ADD COLUMN     "startCommand" TEXT,
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "type" "ServiceType" NOT NULL DEFAULT 'APPLICATION',
DROP COLUMN "status",
ADD COLUMN     "status" "ServiceStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "service_name_key" ON "service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_name_environmentId_key" ON "service"("name", "environmentId");

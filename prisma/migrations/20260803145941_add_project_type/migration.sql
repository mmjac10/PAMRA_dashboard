-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('NEW', 'MAINTENANCE_REPAIR');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'NEW';
